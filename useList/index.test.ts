import { describe, expect, test } from "vitest";
import { ref } from "vue";
import useList from ".";
import response from "./data.json";
import { requestFn } from "./other";

describe("useList", () => {
  test("should have list of response.data and total of 85", async () => {
    const { list, total, loadData } = useList(requestFn);
    await loadData();
    expect(list.value).toEqual(response.data);
    expect(total.value).toEqual(85);
  });

  test("should have filterOption value of {name:'foo'}", async () => {
    const filterOption = ref({});
    const { loadData } = useList(requestFn, {
      filterOption,
      preRequest: () => {
        filterOption.value = { name: "foo" };
      },
    });
    await loadData();
    expect(filterOption.value).toEqual({ name: "foo" });
  });

  test("should have filterOption value of empty", async () => {
    const filterOption = ref({
      name: "foo",
      mobile: "186xxxxxxxx",
      id: "1",
    });
    const { loadData, reset } = useList(requestFn, {
      filterOption,
    });
    await loadData();
    reset();
    expect(filterOption.value).toEqual({});
  });

  test("should have list value of empty array and total of 0", async () => {
    const { list, total } = useList(requestFn, {
      transformFn() {
        return {
          data: [],
          total: 0,
        };
      },
    });
    expect(list.value).toEqual([]);
    expect(total.value).toEqual(0);
  });
});
