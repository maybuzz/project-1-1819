// horizontal scroll voor cursussen
// homepage ? of default boeken
// taal knoppen fixen

import { API } from '../../node_modules/oba-wrapper/js/index.js'

const app = {
  init: () => {
    const booksBtn = document.getElementById('booksBtn')
    const courseBtn = document.getElementById('courseBtn')

    booksBtn.onclick = app.initBooks
    courseBtn.onclick = app.initCourses

    api.getBooks()
  },
  initBooks: () => {
    clear.clearCourses()
    api.getBooks()
  },
  initCourses: () => {
    clear.clearBooks()
    api.getCourse()
  }
}

const api = {
  getBooks: async () => {
    if (localStorage.getItem('books')) {
      render.onload()
      return render.listBooks()
    }
    render.onload()
    const oba = new API()
    const bookStream = await oba.createStream("search/for+dummies&facet=type(book)&facet=language(dut)&librarian=true{10}")
    bookStream
      .pipe(data.formatBooks)
      .pipe(render.listBooks)
  },
  getCourse: async () => {
    if (localStorage.getItem('courses')) {
      return render.listCourse()
    }
    render.onload()
    const oba = new API()
    const courseStream = await oba.createStream("search/*&facet=type(Cursus)&librarian=true{10}")
    courseStream
      .pipe(data.formatCourse)
      .pipe(render.listCourse)

    }
}

const data = {
  formatBooks: (bookStream) => {
    console.log("bookStream", bookStream)
    const allBooks = []
    const allData = bookStream.map((book) => {

      const data = {
        title: book.titles.title._attributes['search-term'].split('voor')[0].trim(),
        cover: book.coverimages.coverimage[0] ? book.coverimages.coverimage[0]._text : 'https://v19.nbc.bibliotheek.nl/thumbnail?uri=http://data.bibliotheek.nl/ggc/ppn/417724462&token=c1322402',
        author: book.authors ? book.authors['main-author']._attributes['search-term'] : 'onbekend',
        summary: book.summaries ? book.summaries.summary._text : 'Excuses, er is geen verdere informatie te vinden.',
        language: book.languages ? book.languages.language._text : 'onbekend',
        format: book.formats ? book.formats.format._text : 'onbekend',
        year: book.publication.year['_text']
      }

      allBooks.push(data)

      return data

    })
    window.localStorage.setItem('books',JSON.stringify(allBooks))
  },
  formatCourse: (courseStream) => {
    console.log("stream", courseStream)
    const allCourses = []
    const allData = courseStream.map((course) => {

      const data = {
        title: course.titles.title
          ? (course.titles.title.length > 0
            ? course.titles.title[0]._text
            : course.titles.title._text)
          : course.titles['short-title']._text,
        cover: course.coverimages.coverimage
          ? (course.coverimages.coverimage.length > 0
            ? (course.coverimages.coverimage[1]
              ? course.coverimages.coverimage[1]._text
              : course.coverimages.coverimage[0]._text)
            : course.coverimages.coverimage._text)
          : 'https://v19.nbc.bibliotheek.nl/thumbnail?uri=http://data.bibliotheek.nl/ggc/ppn/417724462&token=c1322402',
        summary: course.summaries ? course.summaries.summary._text : 'Excuses, er is geen verdere informatie te vinden.',
        format: course.formats ? course.formats.format._text : 'onbekend'
      }

      allCourses.push(data)

      return data

    })

    window.localStorage.setItem('courses',JSON.stringify(allCourses))
  }
}

const clear = {
  clearBooks: () => {
    const app = document.getElementById('container__books')

    while (app.firstChild) {
        app.removeChild(app.firstChild)
    }
  },
  clearCourses: () => {
    const app = document.getElementById('container__courses')

    while (app.firstChild) {
        app.removeChild(app.firstChild)
    }
  }
}

const render = {
  listBooks: () => {

    if(document.getElementById('spinner') != undefined){
      document.getElementById('spinner').remove()
    }

    const books = JSON.parse(localStorage.getItem('books'))

    if (books === null) {
      render.error('books data undefined')
      return
    }

    console.log(books)

    const container1 = document.getElementById('container__books')

    const div1 = document.createElement('div')
          div1.setAttribute('class', 'container__books__side')

    const dutBtn = document.createElement('a')
          dutBtn.setAttribute('class', 'btn btn__lang')
          dutBtn.setAttribute('href', '#')
          dutBtn.textContent = 'nederlandstalig'

    const engBtn = document.createElement('a')
          engBtn.setAttribute('class', 'btn btn__lang')
          engBtn.setAttribute('href', '#')
          engBtn.textContent = 'engelstalig'

    const div2 = document.createElement('div')
          div2.setAttribute('id', 'container__books__content')
          div2.setAttribute('class', 'container__books__content')

    const title1 = document.createElement('h2')
          title1.textContent = 'Bibliotheek'

    const sub = document.createElement('p')
          sub.textContent = 'hier vindt u alle "voor dummies" boeken binnen de oba.'

          container1.appendChild(div1)
          container1.appendChild(div2)
          div1.appendChild(title1)
          div1.appendChild(sub)
          div1.appendChild(dutBtn)
          div1.appendChild(engBtn)

    return books.forEach((book) => {

      const container2 = document.getElementById('container__books__content')

      const div3 = document.createElement('div')
            div3.setAttribute('class', 'container__book')

      const link = document.createElement('a')
            link.setAttribute('href', '#')

      const cover = document.createElement('img')
            cover.setAttribute('src', book.cover)
            cover.setAttribute('alt', 'book cover')

      const title = document.createElement('h3')
            title.textContent = book.title.split('for')[0].trim()

            container2.appendChild(div3)
            div3.appendChild(link)
            link.appendChild(cover)
            link.appendChild(title)

      })
  },
  listCourse: () => {

    if(document.getElementById('spinner') != undefined){
      document.getElementById('spinner').remove()
    }

    const courses = JSON.parse(localStorage.getItem('courses'))

    if (courses === null) {
      render.error('course data undefined')
      return
    }

    console.log(courses);

    const container1 = document.getElementById('container__courses')

    const div1 = document.createElement('div')
          div1.setAttribute('class', 'container__courses__side')

    const dutBtn = document.createElement('a')
          dutBtn.setAttribute('class', 'btn', 'btn__lang')
          dutBtn.setAttribute('href', '#')
          dutBtn.textContent = 'nederlandstalig'

    const engBtn = document.createElement('a')
          engBtn.setAttribute('class', 'btn', 'btn__lang')
          engBtn.setAttribute('href', '#')
          engBtn.textContent = 'engelstalig'

    const div2 = document.createElement('div')
          div2.setAttribute('id', 'container__courses__content')
          div2.setAttribute('class', 'container__courses__content')

    const title1 = document.createElement('h2')
          title1.textContent = 'Cursussen'

    const sub = document.createElement('p')
          sub.textContent = 'hier vindt u alle cursussen binnen de oba.'

          container1.appendChild(div1)
          container1.appendChild(div2)
          div1.appendChild(title1)
          div1.appendChild(sub)

    return courses.forEach((course) => {

      const container = document.getElementById('container__courses__content')

      const div = document.createElement('div')
            div.setAttribute('class', 'container__course')

      const link = document.createElement('a')
            link.setAttribute('href', '#')

      const cover = document.createElement('img')
            cover.setAttribute('src', course.cover)
            cover.setAttribute('alt', 'course cover')

      const title = document.createElement('h3')
            title.textContent = course.title

            container.appendChild(div)
            div.appendChild(link)
            link.appendChild(cover)
            link.appendChild(title)

      })
  },
  onload: () => {
    if(document.getElementById('spinner') != undefined){
      document.getElementById('spinner').remove()
    }

    const container = document.getElementById('container__books')

    const spinner = document.createElement('div')
          spinner.setAttribute('id', 'spinner')

    const bounce1 = document.createElement('div')
          bounce1.setAttribute('class', 'double-bounce1')

    const bounce2 = document.createElement('div')
          bounce2.setAttribute('class', 'double-bounce2')

          container.appendChild(spinner)

          spinner.appendChild(bounce1)
          spinner.appendChild(bounce2)
  },
  error: () => {
    console.log('error');
    console.warn('application err: ')

    if(document.getElementById('spinner') != undefined){
      document.getElementById('spinner').remove()
    }

    const app = document.getElementById('error')

    const section = document.createElement('section')

    const title = document.createElement('h1')
          title.setAttribute('class', 'error')
          title.textContent = 'error'

    const text = document.createElement('p')
          text.setAttribute('class', 'text')
          text.textContent = 'Oops... er ging iets fout'


          app.appendChild(section)
          section.appendChild(title)
          section.appendChild(text)
  },
  overview: () => {
    console.log("hier komt shit");
  }
}



app.init()
