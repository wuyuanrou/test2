// pages/songListDetail/songListDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover:"",
    backgroundImg:"",
    playlistName:"",
    creator:"",
    avatarUrl:"",
    description:"",
    playCount: "",
    songs:[]
  },

  goToPlaySong(e){
    var songid=e.currentTarget.dataset.songid
    console.log("songid:", songid)
    wx.navigateTo({
      url: `../../pages/play_song/play_song?id=${songid}`,
    })
  },

  getSongList(playlistid){
    wx.showLoading({
      title: '加载歌单中',
    }),

    wx.request({
      url: 'http://121.40.19.111:3000/playlist/detail',//localhost报400错误
      method: "GET",
      data:{
        id: playlistid
      },
      success: (res)=>{
        console.log("songlistdetail:", res.data)
        this.setData({
          cover: res.data.playlist.coverImgUrl,
          backgroundImg: res.data.playlist.creator.backgroundUrl,
          playlistName: res.data.playlist.name,
          creator: res.data.playlist.creator.nickname,
          avatarUrl: res.data.playlist.creator.avatarUrl, 
          description: res.data.playlist.description,
          songs: [...this.data.songs, ...res.data.playlist.tracks],
          playCount: this.playCountStandard(res.data.playlist.playCount)
        })
      },
      complete: ()=>{wx.hideLoading()}
    })
  },

  playCountStandard(playCount){
    var countStr=""+playCount
    var point=1

    if(countStr.length<5){
      return countStr
    }else if(countStr.length<9){
      var decimal=countStr.substring(countStr.length-4, countStr.length-4+point)//小数后一位
      playCount=playCount/10000

      return parseFloat(parseInt(playCount)+'.'+decimal)+'万'
    }else{
      var decimal=countStr.substring(countStr.length-8, countStr.length-8+point)//小数后一位
      playCount=playCount/100000000

      return parseFloat(parseInt(playCount)+'.'+decimal)+'亿'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options:", options)
    var id=JSON.parse(options.id)
    //var id=19723756
    this.getSongList(id)
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