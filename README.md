# Project 1 @cmda-minor-web · 2018-2019

## Summary
Oba (public library of Amsterdam) "for dummies". An environment for the "for dummies" series and all the courses brought to you by the Oba.

![Oba for dummies, courses](/img/pic.png)

## Table of contents
- [Live demo](#Live-demo)   
- [Install](#Install)   
- [Concept](#Concept)   
- [Features](#Features)   
- [Code](#Code)   
- [To-do](#To-do)   
- [Resources](#Resources)   
- [Credits](#Credits)

## Live demo
[Click here](https://maybuzz.github.io/project1/) to see my live demo.

## Install
This project doesn't have ant dependencies. Fork this project and clone it using the terminal. Start a live-server on the src folder to open the application in your browser.

```bash
  # Open your terminal and insert this link to clone this repo to your device
  git clone https://github.com/your-user-name/project-1-1819.git
```

## Concept
For this project (working for the Oba, the public library of Amsterdam) I created an environment for dummies. The "for dummies" book series is huge. I also collected all the courses the Oba has in their API.

Initially I wanted to add all kinds of DIY workshops and projects, from external API's, but I couldn't find any API's (also, I didn't have a lot of time).

I wanted to combine the two previous courses (css-to-the-rescue and web-app-from-scratch). Working with the API (wafs) and create a nice looking interface.

## Features
- 'library page' with all the dutch **"for dummies"** books
  - author and pubyear
- 'courses page' with all the **courses**
  - link to the website to book the course
- `loading state`
- `error page`

- `textContent` to generate HTML
- `async... await` to connect to  the API
- `.createStream` and `.pipe` to handle the requests and send them to the right module
- `localStorage` to save all the data, saves time and unnecessarily APIcalls. Using prefixes to locate different items in storage.
- `?`, `:` to check the data coming from the API

## Code
For this project [Wouter Lem](https://github.com/maanlamp) wrote a wrapper to make working with the API would be a bit easier. At first this still was a bit confusing.

This code shows my request to the API to collect all the books.

```js
const api = {
  getBooks: async () => {

    // check if data is in localStorage, then render the template
    if (localStorage.getItem('books')) {
      render.onload()// loading state
      return render.listBooks()
    }

    // loading state
    render.onload()

    // connect to the API
    const oba = new API()
    // add queries and facets to define the search term
    const bookStream = await oba.createStream("search/for+dummies&facet=type(book)&facet=language(dut)&librarian=true{500}")

    // send data to the following functions
    bookStream
      .pipe(data.formatBooks)
      .pipe(render.listBooks)
  }
}
```

Here you can see my `async... await` function. The async part is the API connection, the await part is where I create my stream and add my facets. This part will wait till the API is connected before it will try to get data. If it didn't wait it would crash because it will try to get data before it's connected.

This is a highlight of my search url. First I look for everything with the titel "for dummies", next I filter all the books; dutch books in this case. Last but not least I define the amount of results I'd like to get.

```js
const bookStream = await oba.createStream("search/for+dummies&facet=type(book)&facet=language(dut)&librarian=true{500}")
```

This code shows how I format my data the right way and save it to localStorage.
```js
const data = {
  // The parameter 'bookStream' comes from the api object. This contains all the data collected from the api
  formatBooks: function (bookStream) {
    const allBooks = []
    // mapping through the data to create objects for each book
    const allData = bookStream.map((book) => {
      // Here I define all the data I want to collect and use throughout the app
      const data = {
        title: book.titles.title._attributes['search-term'].split('voor')[0].trim(),
        cover: book.coverimages.coverimage[0] ? book.coverimages.coverimage[0]._text : 'https://v19.nbc.bibliotheek.nl/thumbnail?uri=http://data.bibliotheek.nl/ggc/ppn/417724462&token=c1322402',
        author: book.authors ? book.authors['main-author']._attributes['search-term'] : 'unknown',
        summary: book.summaries ? book.summaries.summary._text : 'unknown.',
        year: book.publication.year ? book.publication.year['_text'] : 'unknown'
      }

      // Push all the formatted data in the empty array
      allBooks.push(data)

      return data

    })

    // Save the allBooks array in localStorage
    // This way I don't have to do an APIcall everytime I want data
    // Here I set my items to localStorage with a prefix 'books'
    window.localStorage.setItem('books',JSON.stringify(allBooks))

    // This is from my render function
    // Here I get my items from localStorage using the prefix 'books'
    const books = JSON.parse(localStorage.getItem('books'))
  }
}
```

## To-do
- [x] Connect to API   
- [x] Book page   
- [x] Course page   
- [x] Horizontal scroll   
- [x] Add animations and transitions   
- [ ] Add external API   
- [ ] Switch language in book request   
  - [ ] to english   
- [ ] Add more crazy animations and transitions   
- [ ] The finishing touch   

## Resources
- [Zoekmachine](https://zoeken.oba.nl/)   
- [Wrapper](https://github.com/maanlamp/OBA-wrapper)   
- [Daniel's readme, API docs](https://github.com/DanielvandeVelde/functional-programming)

## Credits
[Wouter Lem](https://github.com/maanlamp) -> wrote the oba wrapper   
[Folker-Jan vd Pol](https://github.com/follywolly) -> helped me out a bit   
[Daniel vd Velde](https://github.com/DanielvandeVelde) -> helped me too   

## License
[MIT](LICENSE) © [Luna May Johansson](https://github.com/maybuzz)
