/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// author: EC
	// last modify: 2016-2-11 12:48

	var volMaga = __webpack_require__(1).volMaga();
	var vol = __webpack_require__(2).vol();
	var lazyLoad = __webpack_require__(4).lazyLoad;
	var Slides = __webpack_require__(5).Slides();
	var setShare = __webpack_require__(6).setShare;

	var cases = angular.module('cases', ['ngRoute']), 
		data = [], 
		// qrIdPre = 'caseqc_', 
		h5type = [{"name": "其他", "id": 0}, 
			{"name": "游戏", "id": 1}, 
			{"name": "短片", "id": 2}, 
			{"name": "翻页动画", "id": 3}, 
			{"name": "多屏互动", "id": 4}], 			//案例类型表
		indexHref = 'maga.html', 					//索引地址
		$cover = document.querySelector('.cover'), 	//期刊封面钩子
		coverLoaded = 'page cover loaded', 			//加载完毕期刊封面类名
		sec = '.ar_sec', 							//每屏内容类
		indexLi = '.li_cover', 						//索引项类
		$indexCover = document.querySelector('.fcover'), //索引封面
		indexCoverLoaded = 'page fcover loaded', 	//加载完毕索引封面类名
		$magaBox = document.getElementById('magazines'), //期刊容器
		$indexBox = document.getElementById('index'), //索引容器
		likeClass = '.ar_love', 					//点赞类名
		indexJumpClass = ['.ar_list', '.bc_back'], 	//索引页入口按钮类名
		aotuBlue = ['A2C0F9', '6190e8']; 			//凹凸蓝


	// 期刊链接处理
	function jumpHref(jumpPath){
		var p = location.pathname, 
			pArr = p.split('/');
		pArr.pop();
		p = location.origin+pArr.join('/')+'/'+jumpPath;

		return p;
	}

	// 索引设置
	function indexSet($scope){
		$magaBox.style.display = 'none';
		$indexBox.style.display = 'block';
		$indexBox.style.transform = 'translateY(0)';
		$indexBox.style.webkitTransform = 'translateY(0)';
		var show = setInterval(function(){
			var bb = document.querySelectorAll(indexLi).length;

			if(bb===$scope.volList.length){
				clearInterval(show);
				$indexCover.setAttribute('class', indexCoverLoaded);
				setTimeout(function(){$indexCover.style.display="none";}, 1000);

				lazyLoad(document.getElementById('index'));
			}
		});
	}

	// 索引添加单击事件
	function coverClick(item) {
		document.querySelector(item).addEventListener('click', function(){
			location.href = jumpHref(indexHref);
		});
	}

	// 期刊设置
	function magaSet(){
		$magaBox.style.display = 'block';
		$indexBox.style.display = 'none';
		$magaBox.style.transform = 'translateY(0)';
		$magaBox.style.webkitTransform = 'translateY(0)';
	}

	// 期刊加载完毕
	function magaLoaded() {
		$cover.setAttribute('class', coverLoaded);
		setTimeout(function(){$cover.style.display="none";}, 1000);
	}

	// 控制器
	cases.controller('casesList', function($scope, $http, $sce) {
		$scope.vol = GetQueryString('vol'); //期数
		
		//设置期数cookie
		var s, preepi = (s = getCookie('epi')) ? s: '';
		setCookie('preepi', preepi);
		setCookie('epi', $scope.vol);

		//字符串转html代码
		var parseHtml = function(item) {
			return $sce.trustAsHtml(item);
		};

		// 点赞初始化
		var likeInit = function(total) {
			for(var i=0; i<total; i++){
				var likeEle = document.querySelectorAll(likeClass)[i];

				likeEle.addEventListener('click', function(e){
					var self = this, 
						key = self.getAttribute('data-key'), 
						likeIndex = self.getAttribute('data-index');
					likePull(key, likeIndex, self);
				});
			}
		}

		// 点赞数据拉取
		var likePull = function (key, likeIndex, self){
			$http.post('http://aotu.jd.com/common/api/up',{key: key})
				.then(function(res){
					var msg = res.data.msg, 
						s, 
						count = (s = $cl[likeIndex].like) ? s : 0;
					if(msg === "点赞成功"){
						$cl[likeIndex].likeClass = ' loved';
						// self.setAttribute('class', 'ar_love loved');
						localStorage.setItem(key, 1);
						count ++;
					}else if(msg === "取消点赞成功"){
						$cl[likeIndex].likeClass = '';
						// self.setAttribute('class', 'ar_love');
						localStorage.removeItem(key);
						count --;
						if(count<0){
							count = 0;
						}
					}
					$cl[likeIndex].like = count ? count : '';
				});
		}

		//跳转索引
		indexJumpClass.map(coverClick);

		window.json1 = function(){
			var volList = volMaga, 
				latest = volList[volList.length-1].vol, 
				before = volList[0].vol - 1,
				pt, projectTime, 
				random = Math.random();
				// random = 0.03;

			$scope.volList = volList.reverse();

			if($scope.vol){
				var latestVol = parseInt(latest.vol), 
					curVol, 
					coverSet = function (item){
						if(item.vol === curVol){
							$scope.date = item.date;
							$scope.cover = item.cover;
							$scope.covers = item.covers;
							$scope.hexocolor = random < 0.1 ? aotuBlue : item.hexocolor;

							if(!!item.prewords && item.prewords!==""){
								var prewordsCont = item.prewords.split('\n');
								$scope.prewords = prewordsCont.map(parseHtml);
							}
						}
					};

				magaSet();

				//最新期
				if($scope.vol === 'latest'){
					$scope.vol = latest;
				}

				curVol = parseInt($scope.vol);

				volList.forEach(coverSet);

				if($scope.date){
					pt = $scope.date.split('-');
					projectTime = new Date(parseInt(pt[0]), parseInt(pt[1])-1, parseInt(pt[2])).toISOString();
					$http.jsonp('http://jdc.jd.com/jdccase/jsonp/project?category=app&projectTime='+projectTime+'&callback=json2');
				}else if(!$scope.date && $scope.vol>latestVol){
					location.href = jumpHref(indexHref);
				}
			}else{
				indexSet($scope);
			}
		}
		json1();

		window.json2 = function (data) { 
			var likeObj = [], 
				likeArr = [];
			data = data;
			$cl = $scope.caselist = data.reverse();

			$cl.forEach(function(item, idx){
				var key = item._id;
				item.index = idx;
				item.vd = item.vd.split(',');
				item.fe=item.fe.split(',');
				item.title=parseHtml(item.title);

				item.fe.forEach(function(feItem, idx2, arr){
					var rate = "", star = "★", 
						starNum = parseInt(feItem);

					for(var k=0; k<starNum; k++){
						rate += star;
					}
					item.fe[idx2] = rate;
				});

				var descCont=item.desc.split('\n');
				h5type.forEach(function(type){
					if(item.type.name===type.name){
						item.type.id = type.id;
					}
				});

				item.desc = descCont.map(parseHtml);
				var linksCont = item.links.map(function(para){return para.url;});
				item.links = linksCont.map(parseHtml);

				$http.get('http://aotu.jd.com/common/api/up/count?key='+key)
					.success((function (key) {
						return function(res){
							var count = res.count ? res.count : '', 
								setlike = function (item){
									if(key === item._id){
										item.like = count;
										if(localStorage.getItem(key)){
											item.likeClass = ' loved';
										}
									}
								};
							$cl.forEach(setlike);
						};
				})(key));
			});

			setTimeout(function(){
				var show = setInterval(function(){
					var bb = document.querySelectorAll(sec).length;
					
					if(bb===($cl.length+1)){
						clearInterval(show);
						magaLoaded();

						likeInit((bb-1)*2);

						Mode.init();
						Slides.secNum = bb;
						Slides.init();
					}
			});}, 1000);
		}

		setShare();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	exports.volMaga = function(){
		var volMaga = [
			{"vol": 1, "date": "2015-10-26", "prewords": "专治灵感枯竭、技术盲症候群", "cover": "images/cover/vol_1.jpg", "covers":"images/cover/vol_1_s.jpg", "hexocolor": ["ffcf28", "ff9d02"], "shareTitle": "开刊号请多指教［鞠躬］", "shareText": "专治灵感枯竭、技术盲症候群"}, 
			{"vol": 2, "date": "2015-11-9", "prewords": "近水楼台先得月", "cover": "images/cover/vol_2.jpg", "covers":"images/cover/vol_2_s.jpg", "hexocolor": ["C3BFD5", "495B81"], "shareTitle": "哗，6个案例个个精彩绝伦", "shareText": "还真的有周杰伦"}, 
			{"vol": 3, "date": "2015-11-23", "prewords": "双十一，真·热（sàng）火（xīn）朝（bìng）天（kuáng）", "cover": "images/cover/3.png", "covers":"images/cover/3_s.png", "hexocolor": ["FE4C4A", "AF004D"], "shareTitle": "双十一特刊：去京东找你妹亲一口［羞涩脸］", "shareText": "看完这些H5再买买买"}, 
			{"vol": 4, "date": "2015-12-28", "prewords": "新年新气象～（是不是有点早", "cover": "images/cover/4.jpg", "covers":"images/cover/4_s.jpg", "hexocolor": ["ffcf28", "ff9d02"], "shareTitle": "做梦都在打牌牌刷钱钱", "shareText": "新年新气象～（是不是有点早"}, 
			{"vol": 5, "date": "2016-01-25", "prewords": "备好一台电脑一二三五部手机", "cover": "images/cover/vol_5.jpg", "covers":"images/cover/vol_5_s.jpg", "hexocolor": ["f6a625", "d73930"], "shareTitle": "不建议一人观看——多屏互动特刊", "shareText": "备好一台电脑一二三五部手机"}, 
			{"vol": 6, "date": "2016-02-29", "prewords": "擦亮你的双眼", "cover": "images/cover/vol_6.jpg", "covers":"images/cover/vol_6_s.jpg", "hexocolor": ["f8cacb", "e04d36"], "shareTitle": "放大世界我看到了金钱和肉体", "shareText": "喂？幺幺零吗？"}, 
			{"vol": 7, "date": "2016-03-28", "prewords": "现在给智商充值还来得及", "cover": "images/cover/vol_7.jpg", "covers":"images/cover/vol_7_s.jpg", "hexocolor": ["BECEBE", "072"], "shareTitle": "一大波文艺段子即将袭来", "shareText": "Look! A pair of boobs! -> (.Y.)"}
		];

		return volMaga;
	}



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var GetQueryString = __webpack_require__(3).GetQueryString;

	exports.vol = function(){
		var vol = GetQueryString('vol')?GetQueryString('vol'):0;
		return vol;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	exports.GetQueryString = function (name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     console.log(r);
	     if(r!=null)return  unescape(r[2]); return null;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	// author: EC
	// last modify: 2015-12-25 13:16

	exports.lazyLoad = function (context){
	    var doc = document,
	        body = doc.body,
	        win = window, 
	        winDoc = win.document.documentElement, 
	        $win = angular.element(win),
	        uid = 0,
	        elements = {}, 
	        imgArr = [], 
	        curW = winDoc.clientWidth - (1.28 * parseFloat(winDoc.style.fontSize));

	    function getUid(el){
	        return el.__uid || (el.__uid = ('' + (++uid)));
	    }

	    function getWindowOffset(){
	        var t,
	            pageXOffset = (typeof win.pageXOffset == 'number') ? win.pageXOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollLeft == 'number' ? t : body).ScrollLeft,
	            pageYOffset = (typeof win.pageYOffset == 'number') ? win.pageYOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollTop == 'number' ? t : body).ScrollTop;
	        return {
	            offsetX: pageXOffset,
	            offsetY: pageYOffset
	        };
	    }

	    function isVisible(iElement){
	        var elem = iElement[0],
	            elemRect = elem.getBoundingClientRect(),
	            windowOffset = getWindowOffset(),
	            winOffsetX = windowOffset.offsetX,
	            winOffsetY = windowOffset.offsetY,
	            elemWidth = elemRect.width,
	            elemHeight = elemRect.height,
	            elemOffsetX = elemRect.left + winOffsetX,
	            elemOffsetY = elemRect.top + winOffsetY,
	            viewWidth = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0),
	            viewHeight = Math.max(doc.documentElement.clientHeight, win.innerHeight || 0),
	            xVisible,
	            yVisible;

	        if(elemOffsetY <= winOffsetY){
	            if(elemOffsetY + elemHeight >= winOffsetY){
	                yVisible = true;
	            }
	        }else if(elemOffsetY >= winOffsetY){
	            if(elemOffsetY <= winOffsetY + viewHeight){
	                yVisible = true;            }
	        }

	        if(elemOffsetX <= winOffsetX){
	            if(elemOffsetX + elemWidth >= winOffsetX){
	                xVisible = true;
	            }
	        }else if(elemOffsetX >= winOffsetX){
	            if(elemOffsetX <= winOffsetX + viewWidth){
	                xVisible = true;
	            }
	        }

	        return xVisible && yVisible;
	    };

	    function checkImage(){
	        Object.keys(elements).forEach(function(key){
	            var obj = elements[key],
	                iElement = obj.iElement,
	                lazySrc = obj.lazySrc, 
	                eleSrc = iElement.attr('src');

	            if(isVisible(iElement) && !eleSrc){
	                iElement.attr('src', lazySrc)
	                    .css({'opacity': 1});
	            }
	        });
	    }

	    $win.bind('scroll', checkImage);
	    $win.bind('resize', checkImage);
	    $win.bind('touchmove', checkImage);

	    function onLoad(){
	        var $el = angular.element(this),
	            uid = getUid($el);

	        $el.css('opacity', 1);

	        if(elements.hasOwnProperty(uid)){
	            delete elements[uid];
	        }
	    }

	    if(context){
	        imgArr = context.getElementsByTagName('img');
	    }else{
	        imgArr = doc.getElementsByTagName('img');
	    }

	    for(var i=0; i<imgArr.length; i++){
	        var el = angular.element(imgArr[i]), 
	            src = imgArr[i].getAttribute('lazy-src'), 
	            oriW = el.attr('data-width') ? parseFloat(el.attr('data-width')) : 0, 
	            oriH = el.attr('data-height') ? parseFloat(el.attr('data-height')) : 0, 
	            ratio = oriW && oriH ? oriH/oriW : 0, 
	            curH = ratio ? Math.ceil(curW*ratio) : 0;

	        el.bind('load', onLoad);

	        if(src){
	            if(isVisible(el)){
	                el.attr('src', src)
	                    .css('opacity', 1);
	            }else{
	                var uid = getUid(el[0]);
	                el.css({
	                    'background-color': '#fff',
	                    'opacity': 1,
	                    '-webkit-transition': 'opacity .2s',
	                    'transition': 'opacity .2s'
	                });
	                elements[uid] = {
	                    iElement: el, 
	                    lazySrc: src
	                };
	            }
	            if(curH){
	                el.css('height', curH + 'px');
	            }
	        }

	        el.unbind('load');
	    }

	    setTimeout(function(){checkImage();}, 200);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// author: EC
	// last modify: 2015-12-25 16:50
	var lazyLoad = __webpack_require__(4).lazyLoad;
	exports.Slides = function(){
		var Slides = {
			// index: document.querySelector('.ar_nav'), 
			bar: document.querySelector('.ar_tool'), 
			secNum: 1, 
			cur: 0, 
			slideWrap: document.querySelector('.ar_wrap'), 
			slideBox: document.querySelector('.article'), 
			moreBtnClass: '.ar_cnt', 
			closeBtnClass: '.ar_full_close',
			detailClass: '.ar_full', 
			secClass: '.ar_sec', 
			frontshade: '.frontshade', 	// 防点透遮罩层

			winWidth: document.documentElement.clientWidth, 
			winHeight: document.documentElement.clientHeight, 
			startPos: 0, 
			move: 1, 
			move2: 1, 

			init: function(){
				var self = this;

				self.setSize();

				document.body.addEventListener('touchmove', self.noMove, false);
				window.onresize = function(){
					self.winWidth = document.documentElement.clientWidth;
					self.winHeight = document.documentElement.clientHeight;

					self.slideBox.style.width =	self.slideWrap.style.width = self.winWidth + 'px';
					self.slideBox.style.height = self.winHeight + 'px';
					self.slideWrap.style.height = self.winHeight * self.secNum + 'px';

					for(var i=0; i<self.secNum; i++){
						var secItem = document.querySelectorAll(self.secClass)[i];
						secItem.style.width = self.winWidth + 'px';
						secItem.style.height = self.winHeight + 'px';
					}
				};

				self.slideWrap.addEventListener('touchstart', function(e){
					self.startPos = e.changedTouches[0].clientY;

					self.slideWrap.addEventListener('touchmove', self.watch);
				});

				for(var i=0; i<self.secNum - 1; i++){
					document.querySelectorAll(self.moreBtnClass)[i].addEventListener('touchend', function(e){
						self.move = 0;

						var endPos = e.changedTouches[0].clientY, 
							posGap = endPos - self.startPos;

						if(posGap === 0){
							var id = this.getAttribute('data-id');
							self.move2 = 0;
							self.floatToggle(id, 'open');
							setCookie('detail', 1);
							document.querySelector(self.frontshade).style.display = 'block';
							setTimeout(function(){document.querySelector(self.frontshade).style.display = 'none'}, 1000);
						}
					});
					document.querySelectorAll(self.closeBtnClass)[i].addEventListener('touchend', function(){
						self.move = 1;
						self.move2 = 1;
						
						var id = this.getAttribute('data-id');
						self.floatToggle(id, 'close');
						delCookie('detail');
						delCookie('scroll');
					});
					document.querySelectorAll(self.detailClass)[i].addEventListener('scroll', function(){
						var scroll = this.scrollTop;
						setCookie('scroll', scroll);
					});
				}
			}, 

			setSize: function(){
				var self = this;
					// indexString = '';

				if(getCookie('epi') === getCookie('preepi')){
						var iniPage = getCookie('page'), 
						iniDetail = getCookie('detail'), 
						iniScroll = getCookie('scroll');
				}else{
					delCookie('page');
					delCookie('detail');
					delCookie('scroll');
				}

				self.slideBox.style.width =	self.slideWrap.style.width = self.winWidth + 'px';
				self.slideBox.style.height = self.winHeight + 'px';
				self.slideWrap.style.height = self.winHeight * self.secNum + 'px';

				for(var i=0; i<self.secNum; i++){
					var secItem = document.querySelectorAll(self.secClass)[i];
					secItem.style.width = self.winWidth + 'px';
					secItem.style.height = self.winHeight + 'px';
				}

				// for(var i=0; i<self.secNum; i++){
				// 	indexString += '<li></li>';
				// }

				// self.index.innerHTML = indexString;
				// self.index.childNodes[self.cur].setAttribute('class', 'cur');

				if(iniPage && iniPage !== '0'){
					self.cur = iniPage - 1;
					self.pageSet(self.cur);
					self.slideWrap.setAttribute('class', 'ar_wrap no_transition');
					// for(var i=0; i<self.secNum; i++){
					// 	lazyLoad(document.querySelectorAll('.ar_sec_wrap')[i]);
					// }
					setTimeout(function(){
						self.slideWrap.setAttribute('class', 'ar_wrap');
					}, 100);
				}else{
					self.pageSet(self.cur);
					// for(var i=0; i<self.secNum; i++){
					// 	lazyLoad(document.querySelectorAll('.ar_sec_wrap')[i]);
					// }
				}

				if(iniDetail && iniDetail !== '0'){
					var detailId = document.querySelectorAll(self.moreBtnClass)[self.cur].getAttribute('data-id');

					self.move = 0;
					self.move2 = 0;
					self.floatToggle(detailId, 'open');
				}

				if(iniScroll){
					var curDetail = document.querySelectorAll(self.detailClass)[self.cur];
					curDetail.scrollTop = iniScroll;
					lazyLoad(curDetail);
				}
			}, 

			noMove: function(e){
				if(Slides.move){
					e.preventDefault();
				}
			}, 

			watch: function(e){
				if(Slides.move2){
					e.preventDefault();
					Slides.endPos = e.changedTouches[0].clientY;
					var posGap = Slides.endPos - Slides.startPos;
					
					if(Math.abs(posGap) > 50){
						Slides.pageMov(posGap);
						Slides.slideWrap.removeEventListener('touchmove', Slides.watch);
					}
				}
			}, 

			pageMov: function(distance){
				var self = this;

				if(distance>0){
					self.cur -= 1;
					if(self.cur < 0){
						self.cur = 0;
					}
				}else if(distance<0){
					self.cur += 1;
					if(self.cur > (self.secNum-1)){
						self.cur = self.secNum - 1;
					}
				}

				self.pageSet(self.cur);
			}, 

			pageSet: function(cur){
				var self = this;
					// indexLi = self.index.childNodes;

				self.slideWrap.style.transform = 'translateY(-' + self.cur * self.winHeight + 'px)';
				self.slideWrap.style.webkitTransform = 'translateY(-' + self.cur * self.winHeight + 'px)';

				for(var i=0; i<self.secNum; i++){
					// if(i===self.cur){
					// 	indexLi[i].setAttribute('class', 'cur');
					// }else{
					// 	indexLi[i].setAttribute('class', '');
					// }

					if(i===(self.cur-1)){
						document.querySelectorAll(self.secClass)[i].setAttribute('class', 'ar_sec prev');
					}else if(i===(self.cur+1)){
						document.querySelectorAll(self.secClass)[i].setAttribute('class', 'ar_sec next');
					}else{
						document.querySelectorAll(self.secClass)[i].setAttribute('class', 'ar_sec');
					}
				}

				setCookie('page', self.cur+1);
			}, 

			floatToggle: function(id, action){
				var self = this;

				if(action === 'open'){
					document.getElementById(id).style.display = 'block';
					// self.index.style.display = 'none';
					self.bar.style.display = 'none';
					document.getElementById(id).setAttribute('class', 'ar_mask mask_show');
					lazyLoad(document.getElementById(id));
				}else if(action === 'close'){
					document.getElementById(id).setAttribute('class', 'ar_mask mask_hide');
					// self.index.style.display = 'block';
					setTimeout(function(){
						document.getElementById(id).style.display = 'none';
						self.bar.style.display = 'block';
					}, 400);
				}
			}
		};
		return Slides;
	}
		

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var wxShare = __webpack_require__(7).wxShare();
	var GetQueryString = __webpack_require__(3).GetQueryString;

	exports.setShare = function(){
		var vol = GetQueryString('vol')?GetQueryString('vol'):0, 
			shareTitle = "H5精品案例赏析", 
			shareText = "凹凸实验室品鉴小分队奉上", 
			volMaga = __webpack_require__(1).volMaga();
			
		volMaga.forEach(function(item, idx){
			if(item.vol === parseInt(vol)){
				if(item.shareTitle){
					shareTitle = item.shareTitle;
				}
				if(item.shareText){
					shareText = item.shareText;
				}
			}
		});

		/*分享*/
		wxShare('http://jdc.jd.com/h5/case/img/share_3.0.png',100,100,location.href,shareTitle,shareText);
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

		/**
		* 微信分享
		*/

	exports.wxShare = function (){	
		var wxShare = function(img_url,img_width,img_height,link,title,desc,callback,appid){
		    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		        WeixinJSBridge.on('menu:share:timeline', function(argv){
		            WeixinJSBridge.invoke('shareTimeline',{
		                "img_url":img_url,
		                "img_width":img_width,
		                "img_height":img_height,
		                "link":link,
		                "title": title,
		                "desc":desc
		            }, function() {
		                callback('timeline');
		            });
		        });

		        WeixinJSBridge.on('menu:share:appmessage', function(argv){

		            WeixinJSBridge.invoke('sendAppMessage',{
		                "appid":appid || "",
		                "img_url":img_url,
		                "img_width":img_width,
		                "img_height":img_height,
		                "link":link,
		                "title": title,
		                "desc":desc
		            }, function() {
		                callback('appmessage');
		            })

		        });


		        WeixinJSBridge.on('menu:share:weibo', function(argv){
		          WeixinJSBridge.invoke('shareWeibo',{
		             "content":title,
		             "url":link
		          }, function(res){
		            callback('weibo');
		          });
		        });

		        WeixinJSBridge.on('menu:share:facebook', function(argv){
		          (dataForWeixin.callback)();
		          WeixinJSBridge.invoke('shareFB',{
		                "img_url":img_url,
		                "img_width":img_width,
		                "img_height":img_height,
		                "link":link,
		                "title": title,
		                "desc":desc
		          }, function(res){
		            callback('facebook');
		          });
		        });

		    })
		}

		return wxShare;
	}
		

/***/ }
/******/ ]);