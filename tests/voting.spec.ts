import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Voting } from "../target/types/voting";

const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey(
	"DedFBB5nQu6jpzffmgQKw7dE7gMTZAU6HsUtHVt2nznp",
);

describe("Voting", () => {
	let context, provider, votingProgram: Program<Voting>;

	beforeAll(async () => {
		context = await startAnchor(
			"",
			[{ name: "voting", programId: votingAddress }],
			[],
		);

		provider = new BankrunProvider(context);

		votingProgram = new Program<Voting>(IDL, provider);
	});

	it("Initialize Poll", async () => {
		await votingProgram.methods
			.initializePoll(
				new anchor.BN(1),
				"Favorite color?",
				new anchor.BN(0),
				new anchor.BN(1741255200),
			)
			.rpc();

		const [pollAddress, num] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
			votingAddress,
		);

		console.log({ pollAddress, num });

		const poll = await votingProgram.account.poll.fetch(pollAddress);

		console.log(poll);

		expect(poll.pollId.toNumber()).toEqual(1);
		expect(poll.description).toEqual("Favorite color?");
		expect(poll.pollStart.toNumber()).toEqual(0);
		expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
	});

	it("Initialize candidate", async () => {
		const [pollAddress] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
			votingAddress,
		);

		const poll = await votingProgram.account.poll.fetch(pollAddress);

		console.log(poll.pollId.toNumber());

		await votingProgram.methods
			.initializeCandidate("Alice", new anchor.BN(1))
			.rpc();

		// expect(poll.candidateAmount.toNumber()).toEqual(1);

		await votingProgram.methods
			.initializeCandidate("Bob", new anchor.BN(1))
			.rpc();

		// expect(poll.candidateAmount.toNumber()).toEqual(2);

		const [aliceAddress, num1] = PublicKey.findProgramAddressSync(
			[
				new anchor.BN(1).toArrayLike(Buffer, "le", 8),
				Buffer.from("Alice"),
			],
			votingAddress,
		);

		console.log({ aliceAddress, num1 });

		const [bobAddress, num2] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Bob")],
			votingAddress,
		);

		console.log({ bobAddress, num2 });

		const aliceCandidate = await votingProgram.account.candidate.fetch(
			aliceAddress,
		);
		const bobCandidate = await votingProgram.account.candidate.fetch(
			bobAddress,
		);

		console.log(aliceCandidate);
		console.log(bobCandidate);

		expect(aliceCandidate.candidateName).toEqual("Alice");
		expect(aliceCandidate.candidateVotes.toNumber()).toEqual(0);

		expect(bobCandidate.candidateName).toEqual("Bob");
		expect(bobCandidate.candidateVotes.toNumber()).toEqual(0);

		console.log(poll);
	});

	it("Vote", async () => {
		await votingProgram.methods.vote("Alice", new anchor.BN(1)).rpc();

		const [pollAddress] = PublicKey.findProgramAddressSync(
			[new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
			votingAddress,
		);

		const [aliceAddress] = PublicKey.findProgramAddressSync(
			[
				new anchor.BN(1).toArrayLike(Buffer, "le", 8),
				Buffer.from("Alice"),
			],
			votingAddress,
		);

		const poll = await votingProgram.account.poll.fetch(pollAddress);
		const aliceCandidate = await votingProgram.account.candidate.fetch(
			aliceAddress,
		);

		console.log(poll);
		console.log(aliceCandidate);

		expect(aliceCandidate.candidateVotes.toNumber()).toEqual(1);
	});
});
