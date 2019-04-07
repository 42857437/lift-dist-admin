var objInit = (function() {
  // 购物车商品初始化
  function productInit() {
    return {
      brand : '',//品牌
      accessoriesLabel : '',//配件编号
      accessoriesName: null,//配件名称
      accessoriesQuality: '',//配件品质
      suggestedPrice: '',//4s店建议售价
      costPrice: '',//成本价
      nKSPrice: '',//牛咖斯单价
      amount: 0,//数量
      repertory: 0,//库存
    };
  }


  return {
   productInit
  };
})();
export { objInit };
