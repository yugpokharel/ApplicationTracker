import assert from "node:assert";
import { test } from "node:test";
import { CreateApplicationSchema } from "./application.validation";

test("CreateApplicationSchema validation", async (t) => {
  await t.test("should succeed with valid input", () => {
    const validData = {
      company_name: "Google",
      job_title: "Software Engineer",
      job_type: "FullTime",
      status: "Applied",
      applied_date: "2026-06-19",
      notes: "Referral from John",
    };
    const result = CreateApplicationSchema.safeParse(validData);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail if company_name is less than 2 characters", () => {
    const invalidData = {
      company_name: "A",
      job_title: "Software Engineer",
      job_type: "FullTime",
      status: "Applied",
      applied_date: "2026-06-19",
    };
    const result = CreateApplicationSchema.safeParse(invalidData);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const issues = result.error.issues;
      assert.ok(issues.some(i => i.path.includes("company_name")));
    }
  });

  await t.test("should fail if job_title is missing", () => {
    const invalidData = {
      company_name: "Google",
      job_type: "FullTime",
      status: "Applied",
      applied_date: "2026-06-19",
    };
    const result = CreateApplicationSchema.safeParse(invalidData as any);
    assert.strictEqual(result.success, false);
  });
});
