import hashlib
import json
import time
from typing import List, Dict

class Block:
    def __init__(self, index: int, transactions: List[Dict], timestamp: float, previous_hash: str, nonce: int = 0):
        self.index = index
        self.transactions = transactions
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = json.dumps({
            "index": self.index,
            "transactions": self.transactions,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True).encode()

        return hashlib.sha256(block_string).hexdigest()

class Blockchain:
    def __init__(self, difficulty: int = 4):
        self.chain = []
        self.pending_transactions = []
        self.difficulty = difficulty
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = Block(0, [], time.time(), "0")
        self.chain.append(genesis_block)

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_transaction(self, sender: str, recipient: str, amount: float):
        self.pending_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount
        })

    def mine_pending_transactions(self, miner_address: str) -> Block:
        # Create an empty block with just the mining reward if no transactions
        if not self.pending_transactions:
            transactions = [{'sender': 'network', 'recipient': miner_address, 'amount': 10.0}]
        else:
            transactions = self.pending_transactions

        new_block = Block(
            len(self.chain),
            transactions,
            time.time(),
            self.get_latest_block().hash
        )

        new_block = self.proof_of_work(new_block)
        self.chain.append(new_block)

        # Clear pending transactions and add mining reward for next block
        self.pending_transactions = [
            {'sender': 'network', 'recipient': miner_address, 'amount': 10.0}
        ]

        return new_block

    def proof_of_work(self, block: Block) -> Block:
        target = "0" * self.difficulty

        while block.hash[:self.difficulty] != target:
            block.nonce += 1
            block.hash = block.calculate_hash()

        return block

    def is_chain_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            # Verify current block's hash
            if current_block.hash != current_block.calculate_hash():
                return False

            # Verify chain linkage
            if current_block.previous_hash != previous_block.hash:
                return False

            # Verify proof of work
            if current_block.hash[:self.difficulty] != "0" * self.difficulty:
                return False

        return True

    def get_chain_data(self) -> List[Dict]:
        return [
            {
                'index': block.index,
                'timestamp': block.timestamp,
                'transactions': block.transactions,
                'previous_hash': block.previous_hash,
                'hash': block.hash,
                'nonce': block.nonce
            }
            for block in self.chain
        ]