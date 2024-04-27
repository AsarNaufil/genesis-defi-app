import { useState, FormEvent } from "react";
import { ExternalProvider } from "@ethersproject/providers";
import TransactionsABI from "@/constants/TransactionsABI.json";
import { toast } from "sonner";
import TransactionDetails from "@/components/ui/TransactionDetails";
import { contractAddress } from "@/constants";
import { IconReload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

const PaymentsPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

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

     window.ethereum.send({ method:"eth_requestAccounts"}, () => {})
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

    } catch (err: unknown ) {
      toast("An error occurred while processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="m-4" onSubmit={handleSubmit}>
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
            {transactions.length > 0 && <h2 className="font-semibold text-gray-700 dark:text-white text-lg mt-4">Transactions</h2>}

            <ul className="list-disc pl-5">
              {transactions.map((tx, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-400" onClick={() => setSelectedTransaction(tx)}>
                  Transaction: {tx}
                </li>
              ))}
            </ul>
            {selectedTransaction && (
              <div className="transaction-details">
                <p>Transaction: {selectedTransaction}</p>
                <TransactionDetails transaction={transactionDetails} />
              </div>
            )}
          </div>
        </footer>
      </div>
    </form>
  );
};

export default PaymentsPage;

