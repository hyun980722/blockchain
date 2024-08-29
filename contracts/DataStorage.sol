// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataStorage {

    // 검증된 데이터 구조체
    struct VerifiedData {
        string dataHash; // 데이터의 해시 값
        address submitter; // 데이터를 제출한 사람의 주소
        uint timestamp; // 데이터가 검증된 시간
    }

    address public owner; // 스마트 컨트랙트의 소유자
    uint public verifiedDataCount; // 검증된 데이터 수
    mapping(uint => VerifiedData) public verifiedDataRegistry; // 검증 ID와 데이터 구조체를 매핑하는 데이터베이스

    // 오직 소유자만 실행할 수 있는 기능을 제한하는 수식어
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // 컨트랙트 생성자: 스마트 컨트랙트 배포 시 소유자를 설정
    constructor() {
        owner = msg.sender;
    }

    // 데이터가 검증되어 블록체인에 등록될 때 발생하는 이벤트
    event DataVerified(uint verifiedDataId, string dataHash, address submitter, uint timestamp);

    // 검증된 데이터를 블록체인에 등록하는 함수
    function registerVerifiedData(string memory _dataHash, address _submitter) public onlyOwner returns (uint) {
        verifiedDataCount++; // 검증된 데이터 ID 증가

        VerifiedData storage newVerifiedData = verifiedDataRegistry[verifiedDataCount]; // 새로운 검증된 데이터 구조체 생성
        newVerifiedData.dataHash = _dataHash; // 해시 값 저장
        newVerifiedData.submitter = _submitter; // 제출자 주소 저장
        newVerifiedData.timestamp = block.timestamp; // 데이터가 검증된 시간 기록

        emit DataVerified(verifiedDataCount, _dataHash, _submitter, block.timestamp);

        return verifiedDataCount; // 검증된 데이터 ID 반환
    }

    // 특정 검증된 데이터의 해시 값을 반환하는 함수
    function getDataHash(uint _verifiedDataId) public view returns (string memory) {
        VerifiedData storage verifiedData = verifiedDataRegistry[_verifiedDataId]; // 데이터베이스에서 해당 데이터를 가져옴
        require(bytes(verifiedData.dataHash).length > 0, "Data does not exist"); // 데이터가 존재하는지 확인

        return verifiedData.dataHash; // 해시 값 반환
    }

    // 검증된 데이터의 제출자 주소를 반환하는 함수
    function getSubmitter(uint _verifiedDataId) public view returns (address) {
        VerifiedData storage verifiedData = verifiedDataRegistry[_verifiedDataId]; // 데이터베이스에서 해당 데이터를 가져옴
        require(bytes(verifiedData.dataHash).length > 0, "Data does not exist"); // 데이터가 존재하는지 확인

        return verifiedData.submitter; // 제출자 주소 반환
    }

    // 검증된 데이터의 타임스탬프를 반환하는 함수
    function getTimestamp(uint _verifiedDataId) public view returns (uint) {
        VerifiedData storage verifiedData = verifiedDataRegistry[_verifiedDataId]; // 데이터베이스에서 해당 데이터를 가져옴
        require(bytes(verifiedData.dataHash).length > 0, "Data does not exist"); // 데이터가 존재하는지 확인

        return verifiedData.timestamp; // 타임스탬프 반환
    }
}
