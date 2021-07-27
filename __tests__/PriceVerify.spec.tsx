/* eslint-disable no-undef-init */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Item, ItemId } from '../src/redux/store/Item';
import AdditionalDetails from '../src/components/AdditonalDetails';

const expectedPriceItems = 5.99;
const expectedDate = 'unlimited';
const expectedUpcomingPrice = 5;

const ExpectedAdditionalDetail = <AdditionalDetails />;

describe('Priceverify', () => {
  it('Retrieving item price from UPC code(Priceverify feature)', () => {
    type Props = {
      items: Item[];
      reloadItemPrices: (barcode: 5340062, startDate: Date, endDate: Date) => void;
      priceVerifyItems: Item[];
    };

    (props: Props) => {
      const { items, priceVerifyItems } = props;

      let priceItems: ItemId | undefined = undefined;

      if (items.length > 0) {
        item = items[0].itemId;
      }

      if (priceVerifyItems.length > 0) {
        priceItems = priceVerifyItems[0].itemId;
      }

      test.each`
        input         | expectedResult
        ${priceItems} | ${expectedPriceItems}
      `('converts $input to $expectedResult', ({ input, expectedResult }) => {
        expect(input).toBe(expectedResult);
      });
    };
  });

  it('Testing Upcoming End Date(Price Verify Feature)', () => {
    type Props = {
      items: Item[];
      reloadItemPrices: (barcode: 5340062, startDate: Date, endDate: Date) => void;
      priceVerifyItems: Item[];
    };

    (props: Props) => {
      (startDate: Date, endDate: Date) => {
        props.reloadItemPrices(5340062, startDate, endDate);
      };

      test.each`
        input   | expectedResult
        ${Date} | ${expectedDate}
      `('converts $input to $expectedResult', ({ input, expectedResult }) => {
        expect(input).toBe(expectedResult);
      });
    };
  });
  it('Testing Upcoming price when date range changed', () => {
    type Props = {
      items: Item[];
      reloadItemPrices: (barcode: 5340062, startDate: Date, endDate: Date) => void;
      priceVerifyItems: Item[];
    };

    (props: Props) => {
      const { items } = props;

      const upcomingPrice = items[0].itemId.itemsPrices;

      test.each`
        input            | expectedResult
        ${upcomingPrice} | ${expectedUpcomingPrice}
      `('converts $input to $expectedResult', ({ input, expectedResult }) => {
        expect(input).toBe(expectedResult);
      });
    };
  });

  it('Testing when additional details, drop-down button clicked', () => {
    type Props = {
      items: Item[];
      reloadItemPrices: (barcode: 5340062, startDate: Date, endDate: Date) => void;
      priceVerifyItems: Item[];
    };

    (props: Props) => {
      const AdditionalDetail = <AdditionalDetails />;

      test.each`
        input               | expectedResult
        ${AdditionalDetail} | ${ExpectedAdditionalDetail}
      `('converts $input to $expectedResult', ({ input, expectedResult }) => {
        expect(input).toBe(expectedResult);
      });
    };
  });
});
