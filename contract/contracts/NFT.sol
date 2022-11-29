// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFT is
    ERC721Royalty,
    AccessControl,
    Ownable
{
    // libs
    using Strings for uint256;
    using Counters for Counters.Counter;

    // variables
    Counters.Counter private _tokenIdTracker;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    /**
     * @dev Constructor
     */
    constructor() ERC721("Snakes on a chain", "SNAKE") {
        // give deployer admin- and minter-roles
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        // set default royalty
        _setDefaultRoyalty(_msgSender(), 200); // 2%
    }


    /** Public getters */

    /**
     * @dev See {IERC721Metadata-tokenURI}. Override attaches ".json" extension to URI.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }

    /**
     * @dev See {https://docs.opensea.io/docs/contract-level-metadata} - Contract Metadata URI.
     */
    function contractURI() external view virtual returns (string memory) {
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(_baseURI(), "contract.json")) : "";
    }

    /**
     * @dev See {IERC165-supportsInterface} - override required by Solidity.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual
        override(ERC721Royalty, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }


    /** Public setters */

    /**
     * @dev Public mint call, Minter-role only.
     */
    function mint(address to) public virtual onlyRole(MINTER_ROLE) {
        _safeMint(to, _tokenIdTracker.current(), "");
        _tokenIdTracker.increment();
    }

    /**
     * @dev Burns `tokenId`. See {ERC721-_burn}. The caller must own `tokenId` or be an approved operator.
     */
    function burn(uint256 tokenId) public virtual {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner nor approved");
        _burn(tokenId);
    }

    /**
     * @dev Multi-Mint (same recipient).
     */
    function mintMulti(address to, uint16 tokens) public virtual {
        for (uint16 i = 0; i < tokens; i++) {
            mint(to);
        }
    }

    /**
     * @dev Airdrop / Multi-Mint for different recipients.
     */
    function airdrop(address[] memory recipients) public virtual {
        for (uint16 i = 0; i < recipients.length; i++) {
            mint(recipients[i]);
        }
    }

    /**
     * @dev Multi-Transfer.
     */
    function transferMulti(address from, address to, uint256[] memory tokenIds) public virtual {
        for (uint16 i = 0; i < tokenIds.length; i++) {
            safeTransferFrom(from, to, tokenIds[i], "");
        }
    }


    /** Internal methods */

    /**
     * @dev Base URI override for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://snakes.connectednft.art/token/";
    }
}
