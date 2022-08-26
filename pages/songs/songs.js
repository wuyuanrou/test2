// pages/songs/songs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord: "",
    songs:[],
    isLoading: false,
    pages: 0,
    //songId: -1,
    //imgUrl: "",
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

  getKeyWord(keyword, page){
    wx.showLoading({
      title: '加载歌曲中',
    }),

    this.setData({keyWord: keyword})
    wx.request({
      url: 'http://121.40.19.111:3000/search',
      method: "GET",
      data: {
        keywords: keyword,
        offset: (page-1)*30
      },
      success: (res)=>{
        console.log("songs:",res.data),
        this.setData({
          songs: [...this.data.songs, ...res.data.result.songs],
          pages: page
        })
      },
      complete: ()=>{
        wx.hideLoading()
        this.setData({
          isLoading: false
        })
      }
    })
  },

  checkMusic(e){
    var songid=e.currentTarget.dataset.songid
    console.log("checkmusicid:", songid),
    wx.request({
      url: 'http://localhost:3000/check/music',
      method: "GET",
      data: {
        id: songid
      },
      success: (res)=>{
        console.log("checkmusic:",res.data, "songid:", songid)
        console.log(res.data.message)
        if(res.data.message=='ok'){
          console.log("can play")
          return true
        }else{
          console.log('can not play')
          return false
        }
      }
    })
  },

  playSong(e){
    console.log("id:", e.currentTarget.dataset.songid)
    var songId=JSON.stringify(e.currentTarget.dataset.songid)

    wx.navigateTo({
      url: `../../pages/play_song/play_song?id=${songId}`,
    })
  },

  loading(k){
    this.setData({
      isLoading: true
    }),
    this.getKeyWord(k, this.data.pages+1)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("keyword_options:",options)
    var keyword=JSON.parse(options.keywords)
    this.setData({
      keyWord: keyword
    })
    this.getKeyWord(keyword, 1)
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

   /*触底刷新 */
  onReachBottom() {
    /*1、防抖节流*/
    /*2、获取下一页数据*/

    if(this.data.isLoading==false){
      this.loading(this.data.keyWord)
    }else{
      console.log("请求尚未完成")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})