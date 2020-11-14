# react公式サイトのTurorialを実施
https://ja.reactjs.org/tutorial/tutorial.html


# 初めて知ったCSS

```css

.square:focus {
  outline: none;
}
/* ua stylesheetではフォームなどのUIをフォーカスした際青い枠が出てしまう */
/* それを打ち消すCSS指定 */

```

# 条件に合わせてコンポーネントのclassNameの個数を変える
```javascript
function Square(props) {
  // ↓↓
  let className = 'square';
  if (props.isHighlighted) {
    className += ' highlighted';
  }
  // ↑↑
  return (
    <button className={className} onClick={props.onClick}> // <---
      {props.value}
    </button>
  );
}
```