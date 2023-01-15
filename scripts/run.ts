const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  await waveContract.getTotalWaves();

  const firstWaveTxn = await waveContract.wave("First message!");
  await firstWaveTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  await waveContract.getTotalWaves();

  const secondWaveTxn = await waveContract
    .connect(randomPerson)
    .wave("Another Message!");
  await secondWaveTxn.wait();

  const thirdWaveTxn = await waveContract
    .connect(randomPerson)
    .wave("This is a third wave!");
  await thirdWaveTxn.wait();

  await waveContract.getTotalWaves();
  await waveContract.getWavers();

  await waveContract.getWaver(randomPerson.address);

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
