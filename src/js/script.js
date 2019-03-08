// horizontal scroll voor cursussen
// homepage ? of default boeken
// taal knoppen fixen

import { API } from './wrapper/index.js'

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
    clear.clearBooks()
    api.getBooks()
  },
  initCourses: () => {
    clear.clearCourses()
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
    const bookStream = await oba.createStream("search/for+dummies&facet=type(book)&facet=language(dut)&librarian=true{100}")

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
    const courseStream = await oba.createStream("search/*&facet=type(Cursus)&librarian=true{100}")
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
        summary: book.summaries ? book.summaries.summary._text : 'onbekend.',
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
          : course.titles['short-title']._text.split(':')[0].trim(),
        cover: course.coverimages.coverimage
          ? (course.coverimages.coverimage.length > 0
            ? (course.coverimages.coverimage[1]
              ? course.coverimages.coverimage[1]._text
              : course.coverimages.coverimage[0]._text)
            : course.coverimages.coverimage._text)
          : 'https://v19.nbc.bibliotheek.nl/thumbnail?uri=http://data.bibliotheek.nl/ggc/ppn/417724462&token=c1322402',
        summary: course.summaries ? course.summaries.summary._text : 'Excuses, er is geen verdere informatie te vinden.',
        link: course.eresources ? course.eresources.eresource._attributes.url : 'geen website'
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

    const divP = document.createElement('div')
          divP.setAttribute('id', 'container__books-parent')

    const div2 = document.createElement('div')
          div2.setAttribute('id', 'container__books__content')
          div2.setAttribute('class', 'container__books__content')

    const title1 = document.createElement('h2')

    const b = document.createElement('span')
          b.setAttribute('class', 'b')
          b.textContent = 'B'

    const i = document.createElement('span')
          i.setAttribute('class', 'ii')
          i.textContent = 'i'

    const bb = document.createElement('span')
          bb.setAttribute('class', 'bb')
          bb.textContent = 'b'

    const l = document.createElement('span')
          l.setAttribute('class', 'l')
          l.textContent = 'l'

    const ii = document.createElement('span')
          ii.setAttribute('class', 'iii')
          ii.textContent = 'i'

    const o = document.createElement('span')
          o.setAttribute('class', 'ooo')
          o.textContent = 'o'

    const t = document.createElement('span')
          t.setAttribute('class', 't')
          t.textContent = 't'

    const h = document.createElement('span')
          h.setAttribute('class', 'h')
          h.textContent = 'h'

    const e = document.createElement('span')
          e.setAttribute('class', 'ee')
          e.textContent = 'e'

    const ee = document.createElement('span')
          ee.setAttribute('class', 'eee')
          ee.textContent = 'e'

    const k = document.createElement('span')
          k.setAttribute('class', 'k')
          k.textContent = 'k'


    const sub = document.createElement('p')
          sub.textContent = 'Hier vindt u alle "voor dummies" boeken binnen de oba.'

          container1.appendChild(div1)
          div1.appendChild(title1)
          title1.appendChild(b)
          title1.appendChild(i)
          title1.appendChild(bb)
          title1.appendChild(l)
          title1.appendChild(ii)
          title1.appendChild(o)
          title1.appendChild(t)
          title1.appendChild(h)
          title1.appendChild(e)
          title1.appendChild(ee)
          title1.appendChild(k)
          div1.appendChild(sub)
          container1.appendChild(divP)
          divP.appendChild(div2)

    const container2 = document.getElementById('container__books__content')

    return books.forEach((book) => {

      const div3 = document.createElement('div')
            div3.setAttribute('class', 'container__book')

      const link = document.createElement('a')
            link.setAttribute('href', '#')
            link.setAttribute('class', 'link__book')

      const hold = document.createElement('div')
            hold.setAttribute('class', 'holder')

      const cover = document.createElement('img')
            cover.setAttribute('src', book.cover)
            cover.setAttribute('alt', 'book cover')

      const title = document.createElement('h3')
            title.textContent = book.title.split('for')[0].trim()

      const author = document.createElement('p')
            author.setAttribute('class', 'author')
            author.textContent = book.author

      const year = document.createElement('p')
            year.setAttribute('class', 'year')
            year.textContent = book.year

            container2.appendChild(div3)
            div3.appendChild(link)
            link.appendChild(hold)
            hold.appendChild(cover)
            link.appendChild(title)
            div3.appendChild(author)
            div3.appendChild(year)

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

    const divP = document.createElement('div')
          divP.setAttribute('id', 'container__courses-parent')

    const div2 = document.createElement('div')
          div2.setAttribute('id', 'container__courses__content')
          div2.setAttribute('class', 'container__courses__content')

    const title1 = document.createElement('h2')

    const c = document.createElement('span')
          c.setAttribute('class', 'c')
          c.textContent = 'C'

    const u = document.createElement('span')
          u.setAttribute('class', 'uu')
          u.textContent = 'u'

    const r = document.createElement('span')
          r.setAttribute('class', 'rr')
          r.textContent = 'r'

    const s = document.createElement('span')
          s.setAttribute('class', 'ss')
          s.textContent = 's'

    const uu = document.createElement('span')
          uu.setAttribute('class', 'uuu')
          uu.textContent = 'u'

    const ss = document.createElement('span')
          ss.setAttribute('class', 'sss')
          ss.textContent = 's'

    const sss = document.createElement('span')
          sss.setAttribute('class', 'ssss')
          sss.textContent = 's'

    const e = document.createElement('span')
          e.setAttribute('class', 'eeee')
          e.textContent = 'e'

    const n = document.createElement('span')
          n.setAttribute('class', 'n')
          n.textContent = 'n'

    const sub = document.createElement('p')
          sub.textContent = 'Hier vindt u alle cursussen binnen de oba.'

          container1.appendChild(div1)
          container1.appendChild(divP)
          divP.appendChild(div2)
          div1.appendChild(title1)
          title1.appendChild(c)
          title1.appendChild(u)
          title1.appendChild(r)
          title1.appendChild(s)
          title1.appendChild(uu)
          title1.appendChild(ss)
          title1.appendChild(sss)
          title1.appendChild(e)
          title1.appendChild(n)
          div1.appendChild(sub)

    return courses.forEach((course) => {

      const container = document.getElementById('container__courses__content')

      const div = document.createElement('div')
            div.setAttribute('class', 'container__course')

      const link = document.createElement('a')
            link.setAttribute('href', '#')
            link.setAttribute('class', 'link__course')

      const hold = document.createElement('div')
            hold.setAttribute('class', 'holderCourse')

      const cover = document.createElement('img')
            cover.setAttribute('src', course.cover)
            cover.setAttribute('alt', 'course cover')

      const title = document.createElement('h3')
            title.textContent = course.title

      const linkBtn = document.createElement('a')
            linkBtn.setAttribute('class', 'btn')
            linkBtn.setAttribute('href', course.link)
            linkBtn.textContent = 'naar de website'

            container.appendChild(div)
            div.appendChild(link)
            link.appendChild(hold)
            hold.appendChild(cover)
            link.appendChild(title)
            div.appendChild(linkBtn)

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

    const app = document.getElementById('container__books')

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
  }
}

app.init()
