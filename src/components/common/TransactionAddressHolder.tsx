import { formatAddress } from '@/utils';
import React from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { IconClipboard } from '@tabler/icons-react';

interface TransactionAddressHolderProps {
	userAccount: string;
}

const formatAddress2 = (addr: string, length: number) => {
  const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2);
  const totalLength = length + 3; 
  const firstPartLength = Math.floor(totalLength / 2);
  const secondPartLength = totalLength - firstPartLength;
  return `${upperAfterLastTwo.substring(0, firstPartLength - 3)}...${upperAfterLastTwo.substring(upperAfterLastTwo.length - secondPartLength)}`;
};

export const TransactionAddressHolder: React.FC<TransactionAddressHolderProps> = ({ userAccount }) => {
	const copyToClipboard = () => {
		navigator.clipboard.writeText(userAccount)
			.then(() => toast('Address copied to clipboard'))
			.catch((error) => toast('Could not copy address: ', error));
	}
	return (
		<div className='flex gap-2 items-center'>
			<div className="h-9 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors text-muted-foreground">
				{formatAddress2(userAccount, 24)}
			</div>
			<Button className="h-8 py-1 px-2" onClick={copyToClipboard}>
				<IconClipboard className='size-3' />
			</Button>
		</div>
	);
}
