const projectId = "15da3c431a74b29edb63198a503d45b5";

const metadata = {
  name: "FunFart Grab",
  description: "Mint NFTs after winning the game!",
  url: "https://digitalknuckles.github.io/MoveToMint/",
  icons: ["https://digitalknuckles.github.io/MoveToMint/icon.png"]
};

// Supported chains: Polygon (137) and Base (8453)
const supportedChains = [137, 8453];

// ✅ FIXED: No `.default` here
const walletConnectProvider = new window.WalletConnectEthereumProvider({
  projectId,
  chains: supportedChains,
  showQrModal: true,
  metadata
});

window.connectWallet = async function () {
  try {
    await walletConnectProvider.enable();

    const provider = new ethers.providers.Web3Provider(walletConnectProvider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    console.log("🔌 Wallet connected:", address);
    return { provider, signer, address };
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
