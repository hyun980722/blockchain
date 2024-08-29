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
        "function getDataHash(uint _verifiedDataId) public view returns (string memory)",
        "function getSubmitter(uint _verifiedDataId) public view returns (address)",
        "function getTimestamp(uint _verifiedDataId) public view returns (uint)"
    ];

    // 스마트 컨트랙트 인스턴스 생성
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // 명령행 인자로부터 검증된 데이터 ID를 가져옴
    const verifiedDataId = process.argv[2];

    if (!verifiedDataId) {
        console.error("검증된 데이터 ID가 제공되지 않았습니다.");
        process.exit(1);
    }

    try {
        const dataHash = await contract.getDataHash(verifiedDataId);
        const submitter = await contract.getSubmitter(verifiedDataId);
        const timestamp = await contract.getTimestamp(verifiedDataId);

        console.log("데이터 해시:", dataHash);
        console.log("제출자 주소:", submitter);
        console.log("타임스탬프:", timestamp);
    } catch (error) {
        console.error("데이터 가져오는 중 오류 발생:", error);
    }
}

// 스크립트 실행
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
