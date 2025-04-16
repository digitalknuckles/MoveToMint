const projectId = "15da3c431a74b29edb63198a503d45b5"; // Infura ID if using WalletConnectProvider

const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider, // ✅ No `.default` here
    options: {
      infuraId: projectId, // ✅ Required for WalletConnect v1
    },
  },
};

// ✅ Web3Modal v1 uses this global
const web3Modal = new window.Web3Modal({
  cacheProvider: true,
  providerOptions,
  theme: "light",
});

window.connectWallet = async function () {
  try {
    const instance = await web3Modal.connect(); // ✅ Connect wallet
    const web3Provider = new ethers.providers.Web3Provider(instance);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    console.log("🔌 Wallet connected:", address);
    return { provider: web3Provider, signer, address };
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    alert("❌ Failed to connect wallet: " + (err.message || err));
    return null;
  }
};

window.mintPrizeNFT = async function () {
  const wallet = await window.connectWallet();
  if (!wallet) return;

  try {
    const contract = new ethers.Contract(
      "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca",
      [
        {
          inputs: [],
          name: "mintPrize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      wallet.signer
    );

    const tx = await contract.mintPrize();
    await tx.wait();
    alert("🎉 NFT Minted Successfully!");
  } catch (err) {
    console.error("❌ Minting failed:", err);
    alert("❌ Minting failed: " + (err.reason || err.message || err));
  }
};
const projectId = "15da3c431a74b29edb63198a503d45b5";

// Supported chains (Polygon = 137, Base = 8453)
const supportedChains = [137, 8453];

const metadata = {
  name: "FunFart Grab",
  description: "Mint NFTs after winning the game!",
  url: "https://digitalknuckles.github.io/MoveToMint/",
  icons: ["https://digitalknuckles.github.io/MoveToMint/icon.png"]
};

// WalletConnect provider using EIP-1193
const provider = new WalletConnectProvider.EthereumProvider({
  projectId,
  chains: supportedChains,
  showQrModal: true,
  metadata
});

// Web3Modal instance
const web3Modal = new window.Web3Modal.default({
  walletProviders: [provider],
  themeMode: "light"
});

window.connectWallet = async function () {
  try {
    // Connect to wallet
    await provider.enable();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();

    console.log("🔌 Wallet connected:", address);
    return { provider: ethersProvider, signer, address };
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    alert("❌ Failed to connect wallet: " + (err.message || err));
    return null;
  }
};

window.mintPrizeNFT = async function () {
  const wallet = await window.connectWallet();
  if (!wallet) return;

  try {
    const contract = new ethers.Contract(
      "0x7eFC729a41FC7073dE028712b0FB3950F735f9ca",
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
    await tx.wait();
    alert("🎉 NFT Minted Successfully!");
  } catch (err) {
    console.error("❌ Minting failed:", err);
    alert("❌ Minting failed: " + (err.reason || err.message || err));
  }
};
