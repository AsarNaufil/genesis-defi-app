import { FormEvent, useState } from "react"
// UI
import { Button } from "@/components/ui/button"

// Transaction
import { useSyncProviders } from "../hooks/useSyncProviders"
import { TransactionAddressHolder } from "@/components/common/TransactionAddressHolder";
import { toast } from "sonner";
import { IconReload } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export const PaymentsPage2 = () => {
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail | null>(null);
  const [userAccount, setUserAccount] = useState<string>("")
  const [toAddress, settoAddress] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const providers = useSyncProviders()

  const metamaskProvider = providers.find(provider => provider.info.name === "MetaMask");


  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  // Connect to the selected provider using eth_requestAccounts.
  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accounts: any = await providerWithInfo.provider.request({
        method: "eth_requestAccounts"
      })

      setSelectedWallet(providerWithInfo)
      setUserAccount(accounts?.[0])
    } catch (error) {
      console.error(error)
    }
  }

  async function getAccount() {
    let accounts = await providers[0].provider.request({ method: "eth_requestAccounts" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // HANDLE SUBMIT COPY
  async function sendEth(e: FormEvent<HTMLFormElement>) {
    try {
      let accounts = await providers[0].provider.request({ method: "eth_requestAccounts" });
    } catch (error: { code: number; message: string; }) {
      if (error.code === 4001) {
        toast('User rejected the request.')
      } else {
        toast('Unknown Error: ' + error.message)
      }
    }

    console.log(e);

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

    settoAddress(addr);

    console.log(toAddress);

    metamaskProvider!.provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: userAccount,
          to: toAddress,
          value: amount,
          gasLimit: '0x5028',
          maxPriorityFeePerGas: '0x3b9aca00',
          maxFeePerGas: '0x2540be400',
        },
      ],
    })
      .then((txHash) => {
        console.log(txHash)
        toast('Transaction Sent: ' + txHash)
      })
      .catch((error) => errorHandler(error))
  }


  function log() {
    console.log(providers[0].provider);
    console.log(providers);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

    try {
      setLoading(true);
      toast("Processing payment...");
      if (!window.ethereum) {
        toast("No crypto wallet found. Please install MetaMask or a similar Ethereum wallet extension.");
        return;
      }
      if (typeof window.ethereum.send !== "function") {
        toast("Ethereum provider does not support sending transactions.");
        return;
      }

      window.ethereum.send({ method: "eth_requestAccounts" }, () => { })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, TransactionsABI, signer);
      const amount = ethers.utils.parseEther(ether);
      console.log(amount);

      const tx: ethers.providers.TransactionResponse = await contract.addToBlockchain(addr, amount, "Your message", "Your keyword");
      const txHash = await tx.wait();

      console.log({ ether, addr });
      console.log("tx", txHash);

      setTransactions([...transactions, txHash.transactionHash]);
      setTransactionDetails(txHash);
      setLoading(false);
      toast("Payment processed successfully!");

    } catch (err: unknown) {
      toast("An error occurred while processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-16">
      <form className="m-4" onSubmit={sendEth}>
        <h2 className="text-white">Wallets Detected:</h2>
        <Button className="outline-teal-100" onClick={log}>Log</Button>
        <div className="text-white">
          {
            providers.length > 0 ? providers?.map((provider: EIP6963ProviderDetail) => (
              <Button key={provider.info.uuid} onClick={() => handleConnect(provider)} >
                <span className="flex gap-3">
                  <div>Connect to {provider.info.name}</div>
                  <img className="size-5" src={provider.info.icon} alt={provider.info.name} />
                </span>
              </Button>
            )) :
              <div>
                No Announced Wallet Providers
              </div>
          }
        </div>
        <hr />
        <h2 className="text-white">{userAccount ? "" : "No "}Wallet Selected</h2>
        {
          // TODO: Display connected status
          // provider.isConnected();
        }
        {userAccount &&
          <div className="text-white">
            <div>
              <img src={selectedWallet!.info.icon} alt={selectedWallet!.info.name} />
              <div>{selectedWallet!.info.name}</div>
              <TransactionAddressHolder userAccount={userAccount} />
              {
                // TODO: Replace with good button
              }
              <hr />
              <hr />
              {
                // <Button className="sendEthButton" onClick={sendEth}>Pay now</Button>
              }
            </div>
          </div>
        }



        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white dark:bg-black">
          <main className="my-4 p-4">
            <h1 className="text-2xl my-3 font-semibold text-gray-700 dark:text-white text-center">
              Send ETH payment
            </h1>
            <div className="space-y-4 p-2">
              <Input required name="addr" type="text" placeholder="Recipient Address" />
              <Input required name="ether" type="text" placeholder="Amount in ETH" />
            </div>
          </main>
          <footer className="p-4">
            <Button
              type="submit"
              variant="default"
              disabled={loading}
            >
              {loading ? (<>
                <IconReload className="mr-2 h-4 w-4 animate-spin" />
                Please wait </>) : ('Pay now')}
            </Button>

            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
            <div>
              <ul className="list-disc pl-5">
              </ul>
              {/* Diplay Transaction Hash */}
            </div>
          </footer>
        </div>
      </form>
    </div>
  )
}

export default PaymentsPage2;
