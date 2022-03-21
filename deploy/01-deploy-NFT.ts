import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const deployNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log('Deploying NFT');
  const projectXNFT = await deploy('ProjectX', {
    from: deployer,
    args: [10, 5000],
    log: true,
  });
  log(`Deployed NFT to address ${projectXNFT.address}`);
};

export default deployNFT;
deployNFT.tags = ['all', 'NFT'];
