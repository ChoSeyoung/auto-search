import React, {useState, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {captureRef} from 'react-native-view-shot';
import {Button, View, Text, SafeAreaView, Alert} from 'react-native';

export default () => {
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const webviewRef = useRef(null); // 웹뷰 참조 선언
    const webviewContainerRef = useRef(null); // 웹뷰 컨테이너 참조
    const keywords = ['첫번째 키워드', '두번째 키워드', '세번째 키워드'];

    const executeScrollAndCapture = async (currentIndex) => {
        setTimeout(async () => {
            const scrollScript = `window.scrollTo(0, document.body.scrollHeight);`;
            webviewRef.current?.injectJavaScript(scrollScript);

            setTimeout(async () => {

                try {
                    if (webviewContainerRef.current) {
                        const uri = await captureRef(webviewContainerRef.current, {
                            format: 'png',
                            quality: 0.8,
                        });
                        console.log(`Captured image uri for ${keywords[currentIndex]}:`, uri);
                        setTimeout(() => {
                            handleNextSearch(currentIndex + 1);
                        }, 30000);
                    }
                } catch (error) {
                    console.error('Error capturing screenshot:', error);
                }
            }, 2000);
        }, 2000);
    };

    const onWebViewLoad = () => {
        if (!initialLoadComplete) {
            setInitialLoadComplete(true);

            const keyword = keywords[0];
            const searchScript = `
              document.getElementById('query').value = '${keyword}';
              document.getElementById('MM_SEARCH_FAKE').value = '${keyword}';
              document.querySelector('.sch_btn_search').click();
            `;
            webviewRef.current.injectJavaScript(searchScript);

            executeScrollAndCapture(0);
        }
    };

    const handleNextSearch = (nextIndex) => {
        if (nextIndex < keywords.length) {
            const keyword = keywords[nextIndex];
            const searchScript = `
              document.getElementById('nx_query').value = '${keyword}';
              document.querySelector('.btn_search').click();
            `;
            webviewRef.current.injectJavaScript(searchScript);

            executeScrollAndCapture(nextIndex);
        } else {
            Alert.alert("검색이 완료되었습니다.");
        }
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View ref={webviewContainerRef} style={{flex: 1}}>
                <WebView
                    source={{uri: 'https://naver.com'}}
                    ref={webviewRef}
                    onLoadEnd={onWebViewLoad}
                />
            </View>
        </SafeAreaView>
    );
};
