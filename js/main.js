// HTMLや画像(今回は画像は不使用)が読み込まれたら
//$(document).ready(function(){	// readyイベントはjQueryのver.3以降では非推奨
$(function(){
	/* NHKが公開しているCSVファイルから、コンボボックスで選択した都道府県のコロナウイルスの感染状況を取得する	 */
	// 各都道府県のコロナの感染状況を取得する
	var csvfile = 'https://www3.nhk.or.jp/n-data/opendata/coronavirus/nhk_news_covid19_prefectures_daily_data.csv';
	// コンボボックスで選択した都道府県のコロナウイルスの感染状況を取得する
	function readCsv(data) {
		// csvデータから、コンボボックスで選択した都道府県のIndexを取得する	
		let wIntPrefectureIndex = 0; 
		var target = '#itemlist';
		var csv = $.csv.toArrays(data);
		var itemlist = '';
		// 感染者数の件数や日付の件数のindexをカウントする
		var wIntIndexCount = 0;
		// 日付の配列を取得する	参考：http://wims-tea.hatenablog.jp/entry/2015/06/10/141614
		var date = [];
		// コンボボックスで選択した都道府県の人数一覧が出る
		var Ninzu = [];
		// 使用している端末を確認する
		const ua = navigator.userAgent;
		// 端末の向きを確認する
		var direction = Math.abs(window.orientation);
		// 今日の日付
		var dt = new Date();

		// コンボボックスで選択した都道府県番号を取得する
		$(csv).each(function () {
			if (this[0].length > 0) {
				console.log( $.trim($('.dropdown p').text()));
				// コンボボックスで選択した都道府県名とcvsの都道府県名の列のn行目の値が同じとき
				if (this[2] == $.trim($('.dropdown p').text())) {
					// 選択した都道府県番号を格納する
					wIntPrefectureIndex = this[1];
					// スマホかどうかを判定する(ユーザーエージェントがiphone、またはユーザーエージェントがAndroidかつMobile)	参考：https://indoor-today.com/2230
					if (ua.indexOf('iPhone') > -1 || (ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1)) {
						// スマホの向きの確認	参考：https://cly7796.net/blog/javascript/determining-the-smartphone-orientation/
						if(direction == 90) {
							// 横向き
							// 日付の配列に要素を追加する	配列の要素の追加参考：https://qiita.com/takeharu/items/d75f96f81ff83680013f
							date.push(this[0]);
							// 新規感染者数を配列で取得する
							Ninzu.push(this[3]);
						// 縦向き
						} else {
							// 過去3か月のデータのみをグラフに表示する
							if(dt.setMonth(dt.getMonth()-3) <= new Date(this[0])){
								// 日付の配列に要素を追加する	配列の要素の追加参考：https://qiita.com/takeharu/items/d75f96f81ff83680013f
								date.push(this[0]);
								// 新規感染者数を配列で取得する
								Ninzu.push(this[3]);
							}
						}
					// タブレットまたはPC
					} else {
						// 日付の配列に要素を追加する	配列の要素の追加参考：https://qiita.com/takeharu/items/d75f96f81ff83680013f
						date.push(this[0]);
						// 新規感染者数を配列で取得する
						Ninzu.push(this[3]);
					}
					// 日付の配列に要素を追加する	配列の要素の追加参考：https://qiita.com/takeharu/items/d75f96f81ff83680013f
					//date.push(this[0]);
					// 新規感染者数を配列で取得する
					//Ninzu.push(this[3]);
					// ***** ログ確認 *****
					// 使い方：chromeでF12→Consoleタブを押すと、ログが書かれる
					console.log('日付' + date[wIntIndexCount]);
					console.log('人数' + Ninzu[wIntIndexCount]);
					console.log('要素番号' + wIntIndexCount);
					// ***** ログ確認 *****
					// 件数のカウントを増やす
					wIntIndexCount++;
				// 次の都道府県番号のループに移った場合
				} else if (wIntPrefectureIndex != 0 && wIntPrefectureIndex < this[1]) {
					// ループを抜ける(True:「Continue」と同じ, False:「Exit For」と同じ)
					return false;
				}
				//itemlist += '<tr><td>' + this[0] + '</td><td>' + gender + '</td><td>' + this[2] + '</td></tr>';
			}
		});
		
		var data_graph = [{
			x:date,
			y:Ninzu,
			// 棒グラフを指定してる
			type: 'bar',
			/* コンボボックスで都道府県を選択すると、表示されている都道府県名がグラフ横に表示される */
			name: $.trim($('.dropdown p').text())
		}];
		
		// オプション参考：https://anko.education/reference/plotly-js
		var options = {
			// mod_start_2020/08/26
			// title: data.name + '【' + data.data47[12].name + '】', 
			title:  '1日ごとの発表数【' + $.trim($('.dropdown p').text()) + '】', 
			// mod_end
			xaxis: {
				title: '日付'
			},
			yaxis: {
				title: '人数',
			},
			// 参考(「図のサイズを変更する」の部分)：https://anko.education/reference/plotly-js
			margin: {
				l:100,	// margin-left:100という意味
				b:120	// margin-bottom:120という意味
			}
		};
		
		// 機能面に関するオプション	参考 ：https://plotly.com/javascript/configuration-options/
		var SystemOption = {
			displaylogo: false, /* 参考：日本語訳の「モードバーのPlotlyロゴを非表示にする」のところ */
			responsive: true	/* 参考： 「モードバーのPlotlyロゴを非表示にする」のところ*/
		};


		/* 
			第1引数：表示したいクラスを指定する
			第2引数：グラフのデータ
			第3引数：オプション
			第4引数：機能面に関するオプション
		*/
		
		// コンボボックスで選択するたびに、毎回グラフをNewして、常に1つのグラフに1つのデータを表示する
		Plotly.newPlot('stage', data_graph, options, SystemOption);
		// 1つのグラフに、データを追加表示していく
		// Plotly.plot('stage', data_graph, options, SystemOption);
		// ***** グラフの描画ここまで *****
	}
	
	/* コロナウイルスの感染状況を取得する ここまで */
	
	/* 画面表示時に東京都のコロナの感染状況を取得する */
	$.get(csvfile, readCsv, 'text');
	
	// ここからコンボボックスにクリックイベントを追加したりする
	$(".dropdown").click(function(){
		//$('.menu').css({'z-index':'999'});	// スマホ版で「コンボボックスを閉じているのに選択されてしまう」不具合が起きたら使ってみる
		$(".menu").toggleClass("showMenu");
		$(".menu > li").click(function(){
			$(".dropdown > p").html($(this).html());
			$(".menu").removeClass("showMenu");
			// コンボボックスで選択された都道府県の、コロナの感染状況を取得する
			$.get(csvfile, readCsv, 'text');
			//$('.menu').css({'z-index':'0'});	// スマホ版で「コンボボックスを閉じているのに選択されてしまう」不具合が起きたら使ってみる
		});
	});
	// ここまでコンボボックス
});

// ファーストビューの高さを指定する	参考：https://tech-dig.jp/image-just-size/
/*
function imageJustSize() {
	var mainVisual = document.getElementById('js-main-visual');
	var winH = window.innerHeight;
	mainVisual.style.height = winH + 'px';
};

imageJustSize();

window.addEventListener('resize', imageJustSize);
*/
