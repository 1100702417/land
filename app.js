let provider;
let signer;
let userAddress;

document.getElementById('connectBtn').addEventListener('click', connectWallet);

async function connectWallet() {
  if (window.ethereum) {
    const bitkubMainnet = {
      chainId: '0x238C', // 9100
      chainName: 'Bitkub Chain Mainnet',
      nativeCurrency: {
        name: 'KUB',
        symbol: 'KUB',
        decimals: 18
      },
      rpcUrls: ['https://rpc.bitkubchain.io'],
      blockExplorerUrls: ['https://bkcscan.com']
    };

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [bitkubMainnet]
      });

      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      userAddress = await signer.getAddress();

      document.getElementById('walletAddress').textContent = `🧾 Wallet: ${userAddress}`;
      updateBalance();

    } catch (error) {
      console.error("Connection error:", error);
      alert("เชื่อมต่อไม่สำเร็จ");
    }

  } else {
    alert("กรุณาติดตั้ง MetaMask ก่อน");
  }
}

async function updateBalance() {
  try {
    // KUB Balance
    const balanceBigInt = await provider.getBalance(userAddress);
    const kubBalance = ethers.utils.formatEther(balanceBigInt);

    // KKUB ERC20
    const kkubAddress = "0x5bCeF7bDb39c1f08c450a876A170E655a82e9f63";
    const erc20Abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];
    const kkubContract = new ethers.Contract(kkubAddress, erc20Abi, provider);
    const kkubRaw = await kkubContract.balanceOf(userAddress);
    const kkubDecimals = await kkubContract.decimals();
    const kkubBalance = ethers.utils.formatUnits(kkubRaw, kkubDecimals);

    document.getElementById('balanceDisplay').innerHTML = `
      💰 KUB (Gas): ${parseFloat(kubBalance).toFixed(4)}<br/>
      🪙 KKUB (Token): ${parseFloat(kkubBalance).toFixed(4)}
    `;
  } catch (err) {
    console.error("Error loading balance:", err);
    document.getElementById('balanceDisplay').innerText = '💰 Balance: Error';
  }
}
