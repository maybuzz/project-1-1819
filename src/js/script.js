import { API } from '../../node_modules/oba-wrapper/js/index.js'

const app = {
  init: () => { return api.getData() }
}

const api = {
  getData: async () => {
    if (localStorage.getItem('books')) {
      return render.listBooks()
    }
    const oba = new API()
    // const stream = await oba.createStream("search/for+dummies&librarian=true{500}/type(book)")
    const stream = await oba.createStream("search/for+dummies/type(book)")
    stream
      .pipe(data.formatData)
      .pipe(render.listBooks)
  }
}

const data = {
  formatData: (stream) => {
    const allBooks = []
    const allData = stream.map((book) => {

      const data = {
        title: book.titles.title._attributes['search-term'].split('/')[0].trim(),
        cover: book.coverimages.coverimage[0]._text
      }

      allBooks.push(data)

      return data

    })
    window.localStorage.setItem('books',JSON.stringify(allBooks))
  }
}

const render = {
  listBooks: () => {
    const books = JSON.parse(localStorage.getItem('books'))

    console.log(books);

    return books.forEach((book) => {

      const container = document.getElementById('container__books__content')

      const div = document.createElement('div')
            div.setAttribute('class', 'container__book')

      const cover = document.createElement('img')
            cover.setAttribute('src', book.cover)
            cover.setAttribute('alt', 'book cover')

      const title = document.createElement('h3')
            title.textContent = book.title

            container.appendChild(div)
            div.appendChild(cover)
            div.appendChild(title)

      })
    }
}

app.init()
