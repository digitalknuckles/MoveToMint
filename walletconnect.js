// walletconnect.js
const projectId = "15da3c431a74b29edb63198a503d45b5"; // Use your WalletConnect Cloud projectId

const metadata = {
  name: "FunFart Grab",
  description: "Mint NFTs after winning the game!",
  url: "https://digitalknuckles.github.io/MoveToMint/",
  icons: ["https://digitalknuckles.github.io/MoveToMint/icon.png"]
};

const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default, // Make sure it's injected
    options: {
      projectId: projectId, // Use `projectId`, not `infuraId` for WCv2
      chains: [137], // Polygon Mainnet
      metadata
    }
  }
};

const web3Modal = new window.Web3Modal.default({
  cacheProvider: true,
  providerOptions,
  theme: "light"
});

// Store current signer and provider
let currentWallet = {
  provider: null,
  signer: null,
  address: null
};

window.connectWallet = async function () {
  try {
    const externalProvider = await web3Modal.connect();

    if (!externalProvider) {
      throw new Error("No provider returned from Web3Modal");
    }

    const web3Provider = new ethers.providers.Web3Provider(externalProvider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    currentWallet = { provider: web3Provider, signer, address };

    console.log("🔌 Wallet connected:", address);
    return currentWallet;
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    alert("❌ Failed to connect wallet: " + (err.message || err));
    return null;
  }
};

window.mintPrizeNFT = async function () {
  const wallet = currentWallet.signer ? currentWallet : await window.connectWallet();
  if (!wallet) return;

  try {
    const contract = new ethers.Contract(
      "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca", // Contract address
      [
        {
          inputs: [],
          name: "mintPrize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ],
      wallet.signer
    );

    const tx = await contract.mintPrize();
    console.log("📤 Mint transaction sent:", tx.hash);
    await tx.wait();
    alert("🎉 NFT Minted Successfully!");
  } catch (err) {
    console.error("❌ Minting failed:", err);
    alert("❌ Minting failed: " + (err.reason || err.message || err));
  }
};
