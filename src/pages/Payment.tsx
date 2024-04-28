import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input";

// Transactions
import { FormEvent, useState } from "react"
import { useSyncProviders } from "../hooks/useSyncProviders"
import { TransactionAddressHolder } from "@/components/common/TransactionAddressHolder";
import { toast } from "sonner";
import { IconReload } from "@tabler/icons-react";

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}


const PaymentsPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionCompleted, setTransactionCompleted] = useState<boolean>(false);

  const [transactionHash, setTransactionHash] = useState<string>("");
  const [userAccount, setUserAccount] = useState<string>("")
  const providers = useSyncProviders()
  const metaMaskProvider = providers.find(provider => provider.info.name === "MetaMask");

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      const accounts = await providerWithInfo.provider.request({
        method: "eth_requestAccounts"
      }) as string[];

      setUserAccount(accounts?.[0])
    } catch (error) {
      console.error(error)
    }
  }

  async function errorHandler(error: ProviderRpcError) {
    console.error(error)
    let message = "An unknown error occurred while processing the request."
    switch (error.code) {
      case 4001:
        message = "User rejected the request."
        break
      case -32002:
        message = "The transaction was rejected by the network."
        break
      case -32602:
        message = "Invalid parameters were provided."
        break
      case -32603:
        message = "Internal error occurred."
        break
      case 4100:
        message = "The requested account is locked."
        break
      default:
        break
    }
    toast('Error: ' + message)
  }

  const sendEth = async () => {
    const etherInput = document.getElementById('ether') as HTMLInputElement | null;
    const addrInput = document.getElementById('addr') as HTMLInputElement | null;

    console.log("etherInput", etherInput);
    console.log("addrInput", addrInput);

    if (!addrInput || !addrInput.value.trim()) {
      setError("Recipient Address cannot be empty");
      return;
    }
    const addr = addrInput.value.trim();

    const ether = etherInput ? etherInput.value.trim() : '';
    if (!ether || isNaN(parseFloat(ether))) {
      setError("Amount in ETH must be a valid number");
      return;
    }
    const wei = "0x" + Math.floor(parseFloat(ether) * 10 ** 18).toString(16);

    console.log("userAccount", userAccount);
    console.log("ether: ", ether);
    console.log("addr: ", addr);
    console.log("wei: ", parseInt(wei, 16));

    try {
      setLoading(true);
      toast("Processing payment...");
      const txHash = await metaMaskProvider?.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: userAccount,
            to: addr,
            value: wei,
            gasLimit: '0x5028',
            maxPriorityFeePerGas: '0x3b9aca00',
            maxFeePerGas: '0x2540be400',
          },
        ],
      }) as string;
      setLoading(false);
      setTransactionHash(txHash);
      setTransactionCompleted(true);
      toast("Payment processed successfully!");
    } catch (error) {
      errorHandler(error as ProviderRpcError);
    }
  }

  return (
    <>
      <Drawer>
        {
          metaMaskProvider ? (
            <DrawerTrigger asChild>
              <Button className="m-3" onClick={() => handleConnect(metaMaskProvider)}>
                <span className="flex items-center gap-3">
                  <div>Connect to {metaMaskProvider?.info.name}</div>
                  <img className="size-5" src={metaMaskProvider.info.icon} alt={metaMaskProvider.info.name} />
                </span>
              </Button>
            </DrawerTrigger>
          ) : (
            <div>
              Please Install MetaMask extension
            </div>
          )
        }
        <h2>{userAccount ? "✅" : "❌Not "}Connected</h2>
        <DrawerContent>
          {
            userAccount ? (
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Send a Transaction</DrawerTitle>
                  <DrawerDescription>On the Sepolia Testnet</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex-1 text-center space-y-2 my-3">
                      <Input required id="addr" type="text" placeholder="Recipient Address" />
                      <Input required id="ether" type="text" placeholder="Amount in ETH" />
                    </div>
                  </div>
                  {error && <p className="ml-1 text-red-500 dark:text-red-400">{error}</p>}
                </div>
                <DrawerFooter>
                  <Button
                    type="submit"
                    variant="default"
                    className="m-1 my-2"
                    disabled={loading}
                    onClick={sendEth}
                  >
                    {loading ? (<>
                      <IconReload className="mr-2 h-4 w-4 animate-spin" />
                      Please wait </>) : ('Pay now')}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>

            ) : (
              <div> Please connect to a wallet to send a transaction</div>
            )
          }
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PaymentsPage;
