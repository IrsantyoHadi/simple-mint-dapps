import { ProjectX } from '../typechain-types';
import { deployments, ethers } from 'hardhat';
import { expect } from 'chai';

describe('ProjectX NFT', () => {
  let projectXNFT: ProjectX;

  beforeEach(async () => {
    await deployments.fixture(['all']);
    projectXNFT = await ethers.getContract('ProjectX');
  });

  describe('Minting', () => {
    it('should mint NFT to caller address', async () => {
      const [_, acc1, acc2] = await ethers.getSigners();

      const mint1Tx = await projectXNFT.connect(acc1).mint(1, {
        value: ethers.utils.parseEther('0.04'),
      });
      await mint1Tx.wait(1);

      const mint2Tx = await projectXNFT.connect(acc2).mint(2, {
        value: ethers.utils.parseEther('0.08'),
      });
      await mint2Tx.wait(1);

      const balanceAcc1 = await projectXNFT.balanceOf(acc1.address);
      const balanceAcc2 = await projectXNFT.balanceOf(acc2.address);
      const totalSupply = await projectXNFT.totalSupply();

      expect(balanceAcc1).equal(1);
      expect(balanceAcc2).equal(2);
      expect(totalSupply).equal(3);
    });

    it('should revert if mint amount less than 1', async () => {
      const mint1Tx = projectXNFT.mint(0, {
        value: ethers.utils.parseEther('0.04'),
      });

      await expect(mint1Tx).to.be.revertedWith('You can get no fewer than 1');
    });

    it('should revert if mint value less than mint price', async () => {
      const mint1Tx = projectXNFT.mint(1, {
        value: ethers.utils.parseEther('0.03'),
      });

      const mint2Tx = projectXNFT.mint(2, {
        value: ethers.utils.parseEther('0.05'),
      });

      await expect(mint1Tx).to.be.revertedWith('Please input right amount');
      await expect(mint2Tx).to.be.revertedWith('Please input right amount');
    });

    it('should revert if mint amount more than 10', async () => {
      const mint1Tx = projectXNFT.mint(11, {
        value: ethers.utils.parseEther('0.44'),
      });

      await expect(mint1Tx).to.be.revertedWith('too much');
    });

    it('should revert if mint amount more than max supply', async () => {
      const Token = await ethers.getContractFactory('ProjectX');
      const projectXNFT1 = await Token.deploy(5, 4);
      const mint1Tx = projectXNFT1.mint(5, {
        value: ethers.utils.parseEther('1'),
      });

      await expect(mint1Tx).to.be.revertedWith('reached max supply');
    });
  });

  describe('Url matter', () => {
    beforeEach(async () => {
      const mint1Tx = await projectXNFT.mint(1, {
        value: ethers.utils.parseEther('0.04'),
      });
      await mint1Tx.wait(1);
    });

    it('should setup Base URI for token if contract caller is owner and show base URI when isReveal true', async () => {
      const newBaseUri = 'ipfs://xxxxxx/';
      const setBaseUriTx = await projectXNFT.setBaseURI(newBaseUri);
      await setBaseUriTx.wait(1);
      const flipRevealTx = await projectXNFT.setIsReveal(true);
      await flipRevealTx.wait(1);

      const tokenURI = await projectXNFT.tokenURI(0);

      expect(tokenURI).to.equal(newBaseUri + 0);
    });

    it('should fail when setup Base URI called by other account', async () => {
      const [_, acc1] = await ethers.getSigners();
      await expect(projectXNFT.connect(acc1).setBaseURI('xxxx')).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should setup Unreval URI for token if contract caller is owner and show Unreveal URI when isReveal false', async () => {
      const newUnrevealUri = 'ipfs://xxxxxx/';
      const setUnrevealURITx = await projectXNFT.setUnrevealURI(newUnrevealUri);
      await setUnrevealURITx.wait(1);

      const tokenURI = await projectXNFT.tokenURI(0);

      expect(tokenURI).to.equal(newUnrevealUri);
    });

    it('should fail when setup Unreveal URI called by other account', async () => {
      const [_, acc1] = await ethers.getSigners();
      await expect(projectXNFT.connect(acc1).setUnrevealURI('xxxx')).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });
  });
});
