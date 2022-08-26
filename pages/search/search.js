// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot: [],
    searchWord: "",
  },

  getSearchWord(e){
    console.log(e.detail.value),
    this.setData({
      searchWord: e.detail.value
    })
  },

  sendSearchWord(){
    var searchWord=JSON.stringify(this.data.searchWord)
    console.log("searchword:",searchWord)
    wx.navigateTo({
      url: `../songs/songs?keywords=${searchWord}`,
    })
  },//在wxml绑定了点击事件

  getHotNews(){
    wx.request({
      url: 'http://121.40.19.111:3000/search/hot/detail',
      method: "GET",
      success: (res)=>{
        console.log("hot news:",res.data)
        this.setData({
          hot: [...this.data.hot, ...res.data.data]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHotNews()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})