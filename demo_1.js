const cryptoJs = require('crypto-js');

class Block {

    constructor(index, timestamp, data = {}, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = -1;
        this.hash = '';
    }

    calculateHash() {
        return cryptoJs.SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty) {
        const soManyZeros = new Array(difficulty + 1).join('0'); // npr. za difficulty = 4, ta koda oblikuje string '0000'
        while (this.hash.substring(0, difficulty) !== soManyZeros) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`
            Block #${this.index} succesfully mined with the nonce ${this.nonce}.
            Proof of work: ${this.hash}.
        `);
    }

}

// PROOF OF WORK = MINING
// BITCOIN POTREBUJE TAKSEN HASH BLOKA, KI SE ZACNE Z DOLOCENIM STEVILOM NICEL
// V DOLGEM UGIBANJU, DA NA KONCU PRIDE VEN NATANKO TAKSEN HASH, RACUNALNIK VHODNIM PODATKOM DODAJA NEK NONCE (PONAVADI STEVILKA)
// VEC KOT JE NICEL SPREDAJ V HASHU, VECJA JE TEZAVNOST RACUNANJA OZ. RUDARJENJA
// CILJ NEKEGA BLOCKCHAIN OMREZJA JE NPR. USTVARITI POVPRECNO 1 BLOK NA 10 MINUT
// ZA HITREJSE OMREZJE SE MORAJO BLOKI POTRJEVATI HITREJE (NPR. RIPPLE, ETHEREUM)

class Blockchain {

    constructor() {
        this.chain = [];
        this.difficulty = 4;
        console.log(`Blockchain was created with a difficulty of ${this.difficulty}.\n`);
    }

    addNewBlock(newBlock) {
        if (this.chain.length > 0) {
            newBlock.previousHash = this.chain[this.chain.length - 1].hash;
        }

        console.log('I AM MINING ...');
        newBlock.mineBlock(this.difficulty);

        this.chain.push(newBlock);
        console.log('New mined block was added to the blockchain\n');
    }

    isChainValid() {
        for (let i = 1, length = this.chain.length; i < length; i++) {
            const currentBlock = this.chain[i];
            const oldBlock = this.chain[i - 1];

            // je hash trenutnega bloka pravilen?
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // ali trenutni blok kaze na ustrezni stari blok?
            if (currentBlock.previousHash !== oldBlock.hash) {
                return false;
            }
        }

        // ce pride do sem, je blockchain ustrezen
        return true;
    }
}

let network = new Blockchain();

for (let i = 0; i < 10; i++) {
    network.addNewBlock(new Block(i, Date.now(), { howMuchMoney: Math.random() }));
}

if (network.isChainValid()) {
    console.log('Blockchain je ustrezen (noben ga ni spreminjal)');
} else {
    console.log('Blockchain je napacen (nekdo je spreminjal podatke blokov)!');
}