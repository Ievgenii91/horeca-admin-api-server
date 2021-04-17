import { Markup, Extra } from 'telegraf';

class ProductModel {}

const getTotal = (session, payment = false) => {
  let total = 0;
  session.order.forEach((v) => {
    if (v.addedCrossSales) {
      let sum = 0;
      v.addedCrossSales.forEach((id) => {
        const p = session.products.find((v) => v.id === id);
        if (p) {
          sum += p.price;
        }
      });
      total += sum;
    }
    total += v.total;
  });
  return !payment ? total : total * 100;
};
const getInlineView = (keyboard) => {
  return Extra.HTML().markup((m) => m.inlineKeyboard(keyboard));
};
const addBonusButton = (productsButtons, user, i18n) => {
  if (
    user &&
    (user.bonus_count || user.has_unused_invitation_bonus) &&
    user.orders.length
  ) {
    productsButtons.unshift(
      Markup.callbackButton(i18n.t('bonus_name'), 'BONUS'),
    );
  }
};
const canRenderBonusButton = (user, order) => {
  if (!order || !(order instanceof Array)) {
    return true;
  }
  if (!user) {
    console.error('user not found canRenderBonusButton');
    return false;
  }
  const bonusInOrder = order.find((v) => v.bonus);
  return (
    user.bonus_count + (user.has_unused_invitation_bonus ? 1 : 0) >
    (bonusInOrder ? bonusInOrder.count : 0)
  );
};
const getProductsButtons = (
  products,
  type,
  i18n,
  user = null,
  order = null,
) => {
  const productsButtons = products
    .filter((v) => v.type === type)
    .map((v) => {
      return Markup.callbackButton(
        `✅  ${v.name}   ${v.price} ₴`,
        type + '_' + v.action,
      );
    });
  if (canRenderBonusButton(user, order)) {
    addBonusButton(productsButtons, user, i18n);
  }

  if (!productsButtons.length) {
    return [Markup.callbackButton(i18n.t('no_products'), 'DUMMY')];
  }
  return productsButtons;
};
const getOrderButtons = (order) => {
  const list = [];
  order.forEach((v) => {
    let index = 0;
    if (
      list.filter((t, i) => {
        let ok = t.name === v.name;
        if (ok) {
          index = i;
        }
        return ok;
      }).length
    ) {
      list[index].count += list[index].count;
    } else {
      list.push(v);
    }
  });
  return list.map((v) => {
    return {
      button: Markup.callbackButton(
        `${!v.bonus ? '✅' : ''}  ${v.count || ''} ${v.name}   ${
          v.price * v.count
        } ₴`,
        v.bonus ? 'DUMMY' : v.action + 'INCREMENT',
      ),
      item: v,
    };
  });
};
const viewCrossSales = (p, products) => {
  if (p.addedCrossSales && p.addedCrossSales.length) {
    return p.addedCrossSales
      .map((id) => {
        const cs = products.find((v) => v.id === id);
        if (cs) {
          return ` + ${cs.name.toLowerCase()}\n`;
        }
        return '';
      })
      .join('');
  }
  return '';
};
const getOrderMessage = (ctx, skipSum = false) => {
  const { order, products } = ctx.session;
  if (!order || !order.length) return '';
  const msg = `${ctx.i18n.t('your_order')}:
    \n${order
      .map(
        (v) =>
          `✔️${v.count} ${v.name.toLowerCase()}\n ${viewCrossSales(
            v,
            products,
          )}`,
      )
      .join('')}`;

  return !skipSum
    ? msg +
        `   
    <b>Сума: ${getTotal(ctx.session)} ₴</b>
    `
    : msg;
};
const addEntityAndReturnOrderText = (ctx, actionPrefix) => {
  try {
    let { order, products } = ctx.session;
    const action = ctx.update.callback_query.data.replace(actionPrefix, '');
    const [product] = products.filter(
      (v) => v.id.toString() === action || v.action.toString() === action,
    );
    if (!product) {
      throw new Error(action + ' action not found in products list');
    }
    if (order && order.length) {
      let [productInList] = order.filter((v) => v.name === product.name);
      if (productInList) {
        productInList.increment();
        ctx.session.order = ctx.session.order.map((v) => {
          if (v.name === productInList.name) {
            return productInList;
          }
          return v;
        });
      } else {
        ctx.session.order.push(product);
      }
    } else {
      ctx.session.order = [product];
    }
  } catch (e) {
    console.error(e);
    return ctx.i18n.t('smth_went_wrong');
  }
  return getOrderMessage(ctx);
};

const addBonus = (ctx, action) => {
  try {
    let { order } = ctx.session;
    let bonus = new ProductModel({
      id: action,
      action: action,
      name: ctx.i18n.t('mix_bonus'),
      price: 0,
      count: 1,
      type: 'bar',
      bonus: true,
    });
    if (order) {
      const bonusFound = order.find((v) => v.id === action);
      if (bonusFound) {
        bonusFound.increment();
      } else {
        order.push(bonus);
      }
    } else {
      ctx.session.order = [bonus];
    }
  } catch (e) {
    console.error(e);
    return ctx.i18n.t('smth_went_wrong');
  }
  return getOrderMessage(ctx);
};

export const module = {
  addEntityAndReturnOrderText,
  getTotal,
  getInlineView,
  getProductsButtons,
  getOrderMessage,
  getOrderButtons,
  addBonus,
};
