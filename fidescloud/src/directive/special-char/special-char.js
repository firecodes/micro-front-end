export default{
  update: function(el, { value, modifiers }, vnode) {
    try {
      const input = el.children[0]
      if (!input.value) {
        return false
      }
      input.value = input.value.replace(/[\%\?]/g, '')
      // input.addEventListener('input', function(e) {
      //   // console.log(e)
      // })
      var event = new Event(modifiers.lazy ? 'change' : 'input')
      input.dispatchEvent(event)
      // input.dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
    } catch (e) {
      return false
    }
  }
}

