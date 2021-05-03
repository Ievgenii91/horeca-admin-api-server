import { LineItem } from 'src/schemas/cart.schema';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService(null, null);
  });

  describe('check service', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('total price should be calculated', () => {
      expect(service.getTotalPrice(0, true, 5)).toBe(38);
      expect(service.getTotalPrice(49, true, 5)).toBe(87);
      expect(service.getTotalPrice(98, true, 10)).toBe(141);
      expect(service.getTotalPrice(98, false, 10)).toBe(108);
      expect(service.getTotalPrice(256, false, 5)).toBe(261);
      expect(service.getTotalPrice(299, false, 10)).toBe(309);
      expect(service.getTotalPrice(29, false, 5)).toBe(34);
    });

    it('get packaging price', () => {
      const PACKAGING_PRICE = 5;
      let lineItems = [
        {
          quantity: 2,
        },
        {
          quantity: 3,
        },
        {
          quantity: 1,
        },
      ];
      expect(
        service.getPackagingPrice(lineItems as LineItem[], PACKAGING_PRICE),
      ).toBe(30);
      lineItems = [
        {
          quantity: 1,
        },
        {
          quantity: 1,
        },
      ];
      expect(
        service.getPackagingPrice(lineItems as LineItem[], PACKAGING_PRICE),
      ).toBe(10);
      lineItems = [
        {
          quantity: 1,
        },
      ];
      expect(
        service.getPackagingPrice(lineItems as LineItem[], PACKAGING_PRICE),
      ).toBe(5);
      lineItems = [
        {
          quantity: 6,
        },
      ];
      expect(
        service.getPackagingPrice(lineItems as LineItem[], PACKAGING_PRICE),
      ).toBe(30);
    });
  });
});
