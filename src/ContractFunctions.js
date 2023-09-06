import AggregatorABI from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";
const BN = require("bn.js");
const ethToUsdAggregatorAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

export async function _Bid(
  _bidAmount,
  _noOfBids,
  _userAddress,
  _web3,
  _contractInstance,
  setTransactionOngoing,
  setTransactiontatusPopUp,
  setTransactionErrorModal,
  SetTickets
) {
  try {
    const ether = _bidAmount * _noOfBids;
    const bidAmount = _web3.utils.toWei(ether.toString(), "ether");
    const transaction = await _contractInstance.methods.Bid(_noOfBids).send({
      from: _userAddress,
      value: bidAmount,
      gas: 900000,
      gasPrice: "20000000000",
    });
    const receipt = await _web3.eth.getTransactionReceipt(
      transaction.transactionHash
    );
    if (receipt.status === 1n) {
      setTransactionOngoing(false);
      setTransactiontatusPopUp(true);
      setTimeout(() => {
        setTransactiontatusPopUp(false);
        SetTickets(1);
      }, 7000);
    } else {
      setTransactionErrorModal(true);
      setTransactionOngoing(false);
    }
  } catch (error) {
    setTransactionErrorModal(true);
    setTransactionOngoing(false);
  }
}

export async function _getBidCount(_contractInstance, setBidCount) {
  try {
    const bidCount = await _contractInstance.methods.getBidsCount().call();
    setBidCount(bidCount);
  } catch (error) {
    console.error("Error bidding:", error);
  }
}

export async function _getBidPrice(_contractInstance, setBidPrice, _web3) {
  try {
    const bidPrice = await _contractInstance.methods.bidPrice().call();
    const ethValue = _web3.utils.fromWei(bidPrice, "ether");
    const usdValue = await getCurrentEthToUsdPrice(_web3, ethValue);
    setBidPrice({
      ethValue: ethValue,
      usdValue: usdValue,
    });
  } catch (error) {
    console.error("Error bidding:", error);
  }
}

export async function getCurrentEthToUsdPrice(_web3, ethValue) {
  const aggregatorContract = new _web3.eth.Contract(
    AggregatorABI,
    ethToUsdAggregatorAddress
  );

  try {
    const latestPrice = await aggregatorContract.methods
      .latestRoundData()
      .call();

    const priceInUsdWei = latestPrice.answer;
    const priceInUint256 = convertToUint256(priceInUsdWei);
    const priceInUSD = (priceInUint256 * 1e10 * ethValue) / 1e18;
    return priceInUSD.toFixed(2);
  } catch (error) {
    console.error("Error fetching ETH to USD price:", error);
    return null;
  }
}

function convertToUint256(number) {
  // Convert the number to a string to avoid any potential precision issues
  const numberString = number.toString();

  // Create a BN object from the number string
  const bnValue = new BN(numberString);

  // Convert to a 256-bit unsigned integer (uint256)
  const uint256Value = bnValue.toString(10);

  return uint256Value;
}
