const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    // 이더리움 네트워크 연결
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_NETWORK);

    // 지갑 설정 (배포자나 트랜잭션을 실행할 계정)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // 스마트 컨트랙트 주소와 ABI 설정
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const contractABI = [
        "function registerVerifiedData(string memory _dataHash, address _submitter) public returns (uint)"
    ];

    // 스마트 컨트랙트 인스턴스 생성
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // 명령행 인자로 데이터 해시와 제출자 주소를 가져옴
    const dataHash = process.argv[2];
    const submitterAddress = process.argv[3];

    if (!dataHash || !submitterAddress) {
        console.error("사용법: node registerData.js <dataHash> <submitterAddress>");
        process.exit(1);
    }

    try {
        const tx = await contract.registerVerifiedData(dataHash, submitterAddress);
        console.log("트랜잭션 해시:", tx.hash);

        const receipt = await tx.wait();
        console.log("블록 넘버:", receipt.blockNumber);
        console.log("데이터 등록 완료.");
    } catch (error) {
        console.error("데이터 등록 중 오류 발생:", error);
    }
}

// 스크립트 실행
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
