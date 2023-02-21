import React, { Component } from 'react';
import {Router, Scene} from "react-native-router-flux";
import {
  StatusBar,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  //點擊時會有半透明回饋
  Dimensions,
  //獲取手機螢幕寬度
} from 'react-native';

import Card from './Component/Card';

class App extends Component {
  state = {
    cardSymbols: ['🤯', '😎', '🥵', '🥳', '🤣', '🥰', '🥶', '😃'],
    cardSymbolsInRand: [],
    isOpen: [],
    firstPickedIndex: null,
    secondPickedIndex: null,
    steps: 0,
    isEnd: false,
  };

  initGame = () => {
    let newCardsSymbols = [...this.state.cardSymbols, ...this.state.cardSymbols];
    //複製一份 16 個小圖
    let cardSymbolsInRand = this.shuffleArray(newCardsSymbols)
    let isOpen = []
    for (let i = 0; i < newCardsSymbols.length; i++) {
      isOpen.push(false)
    }

    this.setState({
      // cardSymbolsInRand: cardSymbolsInRand (ES6寫法，當 key與 value 的名稱相同時，可省略 value 的部分)
      cardSymbolsInRand,
      isOpen,
    })
  }
  componentDidMount() {
    this.initGame()
  }

  //將裡面圖案打亂
  shuffleArray = (arr) => {
    let newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
    }
    return newArr
  }
  cardPressHandle = (index) => {
    let isOpen = [...this.state.isOpen]
    //不允許再點擊
    if(isOpen[index]){
      return;
    }
    isOpen[index] = true;

    // 用戶選擇第一張牌時
    if (this.state.firstPickedIndex == null && this.state.secondPickedIndex == null) {
      this.setState({
        isOpen,
        firstPickedIndex: index,
      });
      // 用戶選擇第二張牌時
    } else if (this.state.firstPickedIndex != null && this.state.secondPickedIndex == null) {
      this.setState({
        isOpen,
        secondPickedIndex: index,
      })
    }

    this.setState({
      steps: this.state.steps + 1,
    })
  }

  calculateGameResult = () => {
    if (this.state.firstPickedIndex != null && this.state.secondPickedIndex != null) {
      // 判斷是否結束 
      if (this.state.cardSymbolsInRand.length > 0) {
        let totalOpens = this.state.isOpen.filter((isOpen) => isOpen)
        if (totalOpens.length === this.state.cardSymbolsInRand.length) {
          this.setState({
            isEnd: true,
          })
          return;
        }
      }

      //判斷第一張牌和第二張牌是否相同
      let firstSymbol = this.state.cardSymbolsInRand[this.state.firstPickedIndex];
      let secondSymbol = this.state.cardSymbolsInRand[this.state.secondPickedIndex];

      if (firstSymbol != secondSymbol) {
        //Incorrect
        setTimeout(() => {
          let isOpen = [...this.state.isOpen]
          isOpen[this.state.firstPickedIndex] = false
          isOpen[this.state.secondPickedIndex] = false

          this.setState({
            firstPickedIndex: null,
            secondPickedIndex: null,
            isOpen,
          })
        }, 1000);
      } else {
        //Correct
        this.setState({
          firstPickedIndex: null,
          secondPickedIndex: null,
        })
      }

    }
  }

  //第二張牌有改變時呼叫此函式進行判斷
  componentDidUpdate(prevProps, prevState) {
    if (prevState.secondPickedIndex != this.state.secondPickedIndex) {
      this.calculateGameResult()
    }
  }

  // 重玩
  resetGame = () => {
    this.initGame()

    this.setState({
      firstPickedIndex: null,
      secondPickedIndex: null,
      steps: 0,
      isEnd: false,
    })
  }

  render() {
    return (
      <>
        <StatusBar />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}>Matching Game</Text>
          </View>
          <View style={styles.main}>
            <View style={styles.gameBoard}>
              {this.state.cardSymbolsInRand.map((symbol, index) =>
                <Card key={index} onPress={() => this.cardPressHandle(index)} style={styles.button} fontSize={30} title={symbol} cover="❓" isShow={this.state.isOpen[index]} />
              )}
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {this.state.isEnd ?
                `Congrats you have completd in ${this.state.steps} steps.` :
                `You have tired ${this.state.steps} time(s).`
              }
            </Text>
            {this.state.isEnd ?
              <TouchableOpacity onPress={this.resetGame} style={styles.tryAgainButton}>
                <Text style={styles.tryAgainButtonText}>try Aagin</Text>
              </TouchableOpacity>
              :
              null
            }
          </View>
        </SafeAreaView>
      </>
    )
  }
}
export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "yellow",
  },
  header: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
  },
  main: {
    flex: 3,
    backgroundColor: '#fff',
  },
  footer: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 20,
  },
  gameBoard: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  button: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    margin: (Dimensions.get('window').width - (48 * 4)) / (5 * 2),
  },
  buttonText: {
    fontSize: 30,
  },
  tryAgainButtonText: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    fontSize: 18,
    marginTop: 20,
    color: 'red',
  }
})