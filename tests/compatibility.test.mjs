import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { VERIFIED_DSH_VERSIONS, isVerifiedDshVersion } from "../lib/peers.js";

const manifest = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("compatibility list contains only DSH versions with acceptance evidence", () => {
	assert.deepEqual([...VERIFIED_DSH_VERSIONS], ["0.2.1-alpha.2", "0.2.2-alpha.2", "0.2.2-rc.1"]);
	assert.equal(isVerifiedDshVersion("0.2.1-alpha.2"), true);
	assert.equal(isVerifiedDshVersion("0.2.2-alpha.2"), true);
	assert.equal(isVerifiedDshVersion("0.2.2-rc.1"), true);
	assert.equal(isVerifiedDshVersion("0.2.3-alpha.1"), false);
	assert.equal(isVerifiedDshVersion(undefined), false);
});

test("manifest peer ranges do not make unlisted DSH versions a startup gate", () => {
	for (const name of ["@deepseek-ai/dsh-sandbox", "@deepseek-ai/dsh-sandbox-local"]) {
		assert.equal(manifest.peerDependencies[name], "*");
	}
	assert.equal(manifest.engines?.dsh, undefined, "no engines.dsh override may reintroduce a version gate");
});
