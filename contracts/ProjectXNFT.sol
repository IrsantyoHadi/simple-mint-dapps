// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC721A.sol";

contract ProjectX is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;
    using SafeMath for uint256;

    string private baseURI;
    string private baseExtension;
    string private unrevealURI;
    uint256 public mintPrice = 0.04 ether;
    bool public isReveal = false;

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    constructor(uint256 maxAmountPerMint, uint256 maxCollection)
        ERC721A("ProjectX", "PX", maxAmountPerMint, maxCollection)
    {}

    // WITHDRAW
    function withdraw() external payable onlyOwner {
        (bool man1, ) = payable(0x00000000000000000000000).call{
            value: (address(this).balance * 20) / 100
        }("");
        require(man1);
        (bool man2, ) = payable(0x00000000000000000000000).call{
            value: (address(this).balance * 10) / 100
        }("");
        require(man2);
        (bool man3, ) = payable(0x00000000000000000000000).call{
            value: (address(this).balance * 30) / 100
        }("");
        require(man3);
        (bool man4, ) = payable(0x00000000000000000000000).call{
            value: (address(this).balance * 30) / 100
        }("");
        require(man4);
        (bool man5, ) = payable(0x00000000000000000000000).call{
            value: address(this).balance
        }("");
        require(man5);
    }

    // MINTING
    function mint(uint8 amount) external payable callerIsUser nonReentrant {
        require(amount > 0, "You can get no fewer than 1");
        require(msg.value >= amount * mintPrice, "Please input right amount");
        require(amount <= maxBatchSize, "too much");

        uint256 supply = totalSupply();

        require(supply + amount <= collectionSize, "reached max supply");

        _safeMint(msg.sender, amount);
    }

    // URL MATTER
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "ERC721Metadata: Nonexistent token");

        if (!isReveal) {
            return unrevealURI;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function setBaseURI(string calldata newURI) external onlyOwner {
        baseURI = newURI;
    }

    function setUnrevealURI(string calldata newURI) external onlyOwner {
        unrevealURI = newURI;
    }

    function setIsReveal(bool _isReveal) external onlyOwner {
        isReveal = _isReveal;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
}
