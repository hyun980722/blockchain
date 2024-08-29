import { ethers } from "hardhat";

async function main() {
    // 배포할 스마트 컨트랙트 가져오기
    const DataStorage = await ethers.getContractFactory("DataStorage");

    // 스마트 컨트랙트 배포
    const dataStorage = await DataStorage.deploy();

    // 배포가 완료될 때까지 대기
    await dataStorage.waitForDeployment();

    // 배포된 스마트 컨트랙트의 주소 출력
    console.log("DataStorage deployed to:", await dataStorage.getAddress());
}

// 스크립트 실행
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
