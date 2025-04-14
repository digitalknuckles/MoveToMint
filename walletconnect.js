<script>
  document.addEventListener("DOMContentLoaded", function () {
    // --- WalletConnect & Web3Modal Configuration ---
    const projectId = "15da3c431a74b29edb63198a503d45b5";

    const chains = [
      {
        id: 1,
        name: "Ethereum",
        rpcUrls: ["https://rpc.ankr.com/eth"]
      },
      {
        id: 137,
        name: "Polygon",
        rpcUrls: ["https://polygon-rpc.com"]
      }
    ];

    const metadata = {
      name: "FunFart Grab",
      description: "Mint NFTs after winning the game!",
      url: "https://yourgameurl.com",
      icons: ["https://yourgameurl.com/icon.png"]
    };

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: projectId,
        }
      },
      // Add other providers if needed
    };

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
      theme: "light",
      themeColor: "purple",
      metadata
    });

    // --- Wallet Connection ---
    window.connectWallet = async function () {
      try {
        const provider = await web3Modal.connect();
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();

        console.log("🔌 Wallet connected:", address);
        return { provider: web3Provider, signer, address };
      } catch (err) {
        console.error("❌ Connection failed:", err);
        alert("❌ Failed to connect wallet: " + (err.message || err));
        return null;
      }
    };

    // --- Mint NFT ---
    window.mintPrizeNFT = async function () {
      const wallet = await window.connectWallet();
      if (!wallet) return;

      try {
        const contract = new ethers.Contract("0x7eFC729a41FC7073dE028712b0FB3950F735f9ca", 
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
        console.error("❌ Minting error:", err);
        alert("❌ Minting failed: " + (err.reason || err.message || err));
      }
    };
  });
</script>
