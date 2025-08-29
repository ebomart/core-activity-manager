const {
  getListOfAcitivityDateAndTimeFromTemplate
} = require("../createActivitiesFromTemplate");

describe("Create Activities Template Tests ", () => {
  describe("Create Activities using End Date from Template Tests ", () => {
    describe("Create Daily Activities from Template Tests ", () => {
      it("Should return daily activities when repeating every 2 days", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T08:44:00.183Z",
            type: "DAILY",
            repeating_every: 2,
            end_by: {
              end_date: "2024-01-03"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-31",
            activity_start_datetime: "2023-12-31T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-02",
            activity_start_datetime: "2024-01-02T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return daily activities when repeating every 1 days", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T08:44:00.183Z",
            type: "DAILY",
            repeating_every: 1,
            end_by: {
              end_date: "2024-01-01"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-30",
            activity_start_datetime: "2023-12-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-31",
            activity_start_datetime: "2023-12-31T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-01",
            activity_start_datetime: "2024-01-01T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return daily activities when repeating every 1 days, including start Date", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "DAILY",
            repeating_every: 1,
            end_by: {
              end_date: "2024-01-01"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-30",
            activity_start_datetime: "2023-12-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-31",
            activity_start_datetime: "2023-12-31T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-01",
            activity_start_datetime: "2024-01-01T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });
    });

    describe("Create Weekly Activities from Template Tests ", () => {
      it("Should return Weekly activities when repeating every 1 week with 1 day repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [5], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_date: "2024-01-11"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-04",
            activity_start_datetime: "2024-01-04T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities when repeating every 1 week with 1 day repeat, with diff start time", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T04:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [5], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_date: "2024-01-11"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-01-04",
            activity_start_datetime: "2024-01-04T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities when repeating every 2 week with 1 day repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [5], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 2,
            end_by: {
              end_date: "2024-01-11"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities when repeating every 1 week with 3 days repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [4, 5, 6], // 4 stands for wednesday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_date: "2024-01-11"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-03",
            activity_start_datetime: "2024-01-03T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-04",
            activity_start_datetime: "2024-01-04T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-05",
            activity_start_datetime: "2024-01-05T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-10",
            activity_start_datetime: "2024-01-10T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities when repeating every 2 week with 3 days repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [4, 5, 6], // 4 stands for wednesday where 1 for sunday and 7 for saturday
            repeating_every: 2,
            end_by: {
              end_date: "2024-01-13"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-10",
            activity_start_datetime: "2024-01-10T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-12",
            activity_start_datetime: "2024-01-12T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });
    });

    describe("Create Monthly Activities from Template Tests ", () => {
      it("Should return Monthly activities when repeating every 1 month with 4 date repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [5, 6, 28, 29], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_date: "2024-02-02"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-05",
            activity_start_datetime: "2024-01-05T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-06",
            activity_start_datetime: "2024-01-06T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-28",
            activity_start_datetime: "2024-01-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-29",
            activity_start_datetime: "2024-01-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities when repeating every 1 month with 4 date repeat, excluding start date", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T08:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [5, 6, 28, 29], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_date: "2024-02-02"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-05",
            activity_start_datetime: "2024-01-05T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-06",
            activity_start_datetime: "2024-01-06T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-28",
            activity_start_datetime: "2024-01-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-29",
            activity_start_datetime: "2024-01-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities when repeating every 2 month with 4 dates repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [5, 6, 28, 29, 30], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 2,
            end_by: {
              end_date: "2024-03-30"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-30",
            activity_start_datetime: "2023-12-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-02-05",
            activity_start_datetime: "2024-02-05T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-02-06",
            activity_start_datetime: "2024-02-06T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-02-28",
            activity_start_datetime: "2024-02-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities when repeating every 1 month with 2 date repeat and starting month is FEB", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-02-28T02:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [29, 30], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_date: "2024-04-02"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-03-29",
            activity_start_datetime: "2024-03-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-03-30",
            activity_start_datetime: "2024-03-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities when repeating every 2 month with 2 date repeat and starting month is FEB", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-02-28T04:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [27, 30],
            repeating_every: 2,
            end_by: {
              end_date: "2024-04-02"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities when repeating every 2 month with 2 date repeat and starting month is FEB with long duration", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-02-28T04:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [27, 31],
            repeating_every: 2,
            end_by: {
              end_date: "2024-07-02"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-04-27",
            activity_start_datetime: "2024-04-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-04-30",
            activity_start_datetime: "2024-04-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-06-27",
            activity_start_datetime: "2024-06-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-06-30",
            activity_start_datetime: "2024-06-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities when repeating every 1 month with 2 date repeat and starting month is JAN with short duration", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-01-31T02:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [30],
            repeating_every: 1,
            end_by: {
              end_date: "2024-04-02"
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-03-30",
            activity_start_datetime: "2024-03-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });
    });
  });

  describe("Create Activities using Number Of Occurences from Template Tests ", () => {
    describe("Create Daily Activities using Number Of Occurences from Template Tests ", () => {
      it("Should return daily activities using Number Of Occurences when repeating every 2 days", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T08:44:00.183Z",
            type: "DAILY",
            repeating_every: 2,
            end_by: {
              end_after_occurences: 3
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-31",
            activity_start_datetime: "2023-12-31T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-02",
            activity_start_datetime: "2024-01-02T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return daily activities using Number Of Occurences when repeating every 1 days", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T08:44:00.183Z",
            type: "DAILY",
            repeating_every: 1,
            end_by: {
              end_after_occurences: 4
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-30",
            activity_start_datetime: "2023-12-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-31",
            activity_start_datetime: "2023-12-31T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-01",
            activity_start_datetime: "2024-01-01T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return daily activities when repeating every 1 days, including start Date", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "DAILY",
            repeating_every: 1,
            end_by: {
              end_after_occurences: 5
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-30",
            activity_start_datetime: "2023-12-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-31",
            activity_start_datetime: "2023-12-31T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-01",
            activity_start_datetime: "2024-01-01T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });
    });

    describe("Create Weekly Activities using Number Of Occurences from Template Tests ", () => {
      it("Should return Weekly activities using Number Of Occurences when repeating every 1 week with 1 day repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [5], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_after_occurences: 3
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-04",
            activity_start_datetime: "2024-01-04T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities using Number Of Occurences when repeating every 1 week with 1 day repeat, excluding start date", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [6], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_after_occurences: 3
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-05",
            activity_start_datetime: "2024-01-05T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-12",
            activity_start_datetime: "2024-01-12T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities using Number Of Occurences when repeating every 1 week with 1 day repeat, with diff start time", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T04:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [5], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_after_occurences: 2
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-01-04",
            activity_start_datetime: "2024-01-04T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities using Number Of Occurences when repeating every 2 week with 1 day repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [5], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 2,
            end_by: {
              end_after_occurences: 2
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities using Number Of Occurences when repeating every 1 week with 3 days repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [4, 5, 6], // 4 stands for wednesday where 1 for sunday and 7 for saturday
            repeating_every: 1,
            end_by: {
              end_after_occurences: 7
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-03",
            activity_start_datetime: "2024-01-03T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-04",
            activity_start_datetime: "2024-01-04T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-05",
            activity_start_datetime: "2024-01-05T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-10",
            activity_start_datetime: "2024-01-10T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Weekly activities using Number Of Occurences when repeating every 2 week with 3 days repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "WEEKLY",
            repeating_on: [4, 5, 6], // 4 stands for wednesday where 1 for sunday and 7 for saturday
            repeating_every: 2,
            end_by: {
              end_after_occurences: 5
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-10",
            activity_start_datetime: "2024-01-10T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-11",
            activity_start_datetime: "2024-01-11T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-12",
            activity_start_datetime: "2024-01-12T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });
    });

    describe("Create Monthly Activities using Number Of Occurences from Template Tests ", () => {
      it("Should return Monthly activities using Number Of Occurences when repeating every 1 month with 4 date repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [5, 6, 28, 29],
            repeating_every: 1,
            end_by: {
              end_after_occurences: 6
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-05",
            activity_start_datetime: "2024-01-05T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-06",
            activity_start_datetime: "2024-01-06T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-28",
            activity_start_datetime: "2024-01-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-01-29",
            activity_start_datetime: "2024-01-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities using Number Of Occurences when repeating every 2 month with 4 dates repeat", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2023-12-28T02:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [5, 6, 28, 29, 30],
            repeating_every: 2,
            end_by: {
              end_after_occurences: 7
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2023-12-28",
            activity_start_datetime: "2023-12-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-29",
            activity_start_datetime: "2023-12-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2023-12-30",
            activity_start_datetime: "2023-12-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-02-05",
            activity_start_datetime: "2024-02-05T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-02-06",
            activity_start_datetime: "2024-02-06T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-02-28",
            activity_start_datetime: "2024-02-28T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities using Number Of Occurences when repeating every 1 month with 2 date repeat and starting month is FEB", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-02-28T02:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [29, 30],
            repeating_every: 1,
            end_by: {
              end_after_occurences: 3
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-03-29",
            activity_start_datetime: "2024-03-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-03-30",
            activity_start_datetime: "2024-03-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities using Number Of Occurences when repeating every 2 month with 2 date repeat and starting month is FEB", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-02-28T04:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [27, 30], // 5 stands for Thursday where 1 for sunday and 7 for saturday
            repeating_every: 2,
            end_by: {
              end_after_occurences: 1
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities using Number Of Occurences when repeating every 2 month with 2 date repeat and starting month is FEB with long duration", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-02-28T04:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [27, 31],
            repeating_every: 2,
            end_by: {
              end_after_occurences: 5
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-04-27",
            activity_start_datetime: "2024-04-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-04-30",
            activity_start_datetime: "2024-04-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-06-27",
            activity_start_datetime: "2024-06-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-06-30",
            activity_start_datetime: "2024-06-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities using Number Of Occurences when repeating every 2 month with 1 date repeat and starting month is FEB with long duration", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-02-28T04:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [27],
            repeating_every: 2,
            end_by: {
              end_after_occurences: 5
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-04-27",
            activity_start_datetime: "2024-04-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-06-27",
            activity_start_datetime: "2024-06-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-08-27",
            activity_start_datetime: "2024-08-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-10-27",
            activity_start_datetime: "2024-10-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-12-27",
            activity_start_datetime: "2024-12-27T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });

      it("Should return Monthly activities using Number Of Occurences when repeating every 1 month with 2 date repeat and starting month is JAN with short duration", () => {
        const sampleTemplate = {
          repeat_info: {
            start_datetime: "2024-01-31T02:44:00.183Z",
            type: "MONTHLY",
            repeating_on: [30],
            repeating_every: 1,
            end_by: {
              end_after_occurences: 2
            }
          },
          start_time: "08:00:00",
          end_by_time: "08:30:00"
        };

        const response = getListOfAcitivityDateAndTimeFromTemplate({
          ...sampleTemplate
        });
        expect(response).toEqual([
          {
            activity_date: "2024-02-29",
            activity_start_datetime: "2024-02-29T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          },
          {
            activity_date: "2024-03-30",
            activity_start_datetime: "2024-03-30T02:30:00.000Z",
            end_by_time: "08:30:00",
            start_time: "08:00:00"
          }
        ]);
      });
    });
  });
});
