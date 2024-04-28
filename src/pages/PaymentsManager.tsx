import { FormEvent, useState } from "react"
import { useSyncProviders } from "../hooks/useSyncProviders"
import { Button } from "@/components/ui/button";
import { TransactionAddressHolder } from "@/components/common/TransactionAddressHolder";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { IconReload } from "@tabler/icons-react";

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
export const PaymentsManager = () => {

  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionCompleted, setTransactionCompleted] = useState<boolean>(false);

  const [transactionHash, setTransactionHash] = useState<string>("");
  const [userAccount, setUserAccount] = useState<string>("")
  const providers = useSyncProviders()
  const metaMaskProvider = providers.find(provider => provider.info.name === "MetaMask");

  // Connect to the selected provider using eth_requestAccounts.
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const accounts = await providers[0].provider.request({ method: "eth_requestAccounts" }) as string[];
    setUserAccount(accounts[0]);

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ether = (formData.get("ether") || '').toString().trim();
    const addr = (formData.get("addr") || '').toString().trim();

    if (!addr.trim()) {
      setError("Recipient Address cannot be empty");
      return;
    }
    if (!ether.trim() || isNaN(parseFloat(ether))) {
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


  function log() {
    console.log(providers[0].provider);
    console.log(providers);
    console.log("MetaMask Provider: ", metaMaskProvider);
  }

  return (
    <>
      <Button className="m-3" onClick={log}>Log</Button>
      <div>
        {
          metaMaskProvider ? (
            <Button className="m-3" onClick={() => handleConnect(metaMaskProvider)}>
              <span className="flex items-center gap-3">
                <div>Connect to {metaMaskProvider?.info.name}</div>
                <img className="size-5" src={metaMaskProvider.info.icon} alt={metaMaskProvider.info.name} />
              </span>
            </Button>
          ) : (
            <div>
              Please Install MetaMask extension
            </div>
          )
        }
      </div>
      <hr />
      <h2>{userAccount ? "✅" : "❌Not "}Connected</h2>
      {userAccount &&
        <div>
          <div>
            <TransactionAddressHolder userAccount={userAccount} />
            <hr />

            <form className="m-4" onSubmit={handleSubmit}>
              <div className="credit-card w-full p-3 lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white dark:bg-black">

                <h1 className="text-2xl my-3 font-semibold text-gray-700 dark:text-white text-center">
                  Send ETH payment
                </h1>

                <div className="space-y-4">
                  <Input required name="addr" type="text" placeholder="Recipient Address" />
                  <Input required name="ether" type="text" placeholder="Amount in ETH" />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="m-1 my-2"
                  disabled={loading}
                >
                  {loading ? (<>
                    <IconReload className="mr-2 h-4 w-4 animate-spin" />
                    Please wait </>) : ('Pay now')}
                </Button>

                {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
              </div>
              {transactionCompleted &&
                <TransactionAddressHolder userAccount={transactionHash} />
              }
            </form>
          </div>
        </div >
      }
    </>
  )
}
