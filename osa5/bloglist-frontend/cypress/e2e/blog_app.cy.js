import '../support/commands'

describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Otso Rouhiainen',
      username: 'otsoro',
      password: 'kissakoira1'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    const user2 = {
      name: 'Another Tester',
      username: 'tester',
      password: 'tester123'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('otsoro')
      cy.get('#password').type('kissakoira1')
      cy.get('#login-button').click()
  
      cy.contains('Otso Rouhiainen logged-in')
    })
  
    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('s')
      cy.get('#password').type('s')
      cy.get('#login-button').click()
      cy.get('.error').should('contain', 'Wrong credentials')
    })

    it('fails with wrong password', function() {
      cy.contains('log in').click()
      cy.get('#username').type('otsoro')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
    
      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    
    
      cy.get('html').should('not.contain', 'Otso Rouhiainen logged in')
    })

  })
    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({username: 'otsoro', password: 'kissakoira1'})
      })
      it('a blog can be created', function() {
        cy.contains('new blog').click()
        cy.get('#title-input').type('new title')
        cy.get('#url-input').type('newsite.com')
        cy.get('#author-input').type('new author')
        cy.contains('create').click()

        cy.contains('new title')
      })

      describe('and a blog exists', function() {
        beforeEach(function () {
          cy.createBlog({
            title: 'yet another title',
            url: 'yetanother.com',
            author: 'yet another author'
          })
        })
        it('one of those can be liked', function() {
          cy.contains('view').click()
          cy.contains('like').click()
        })
        it('one of those can be removed', function() {
          cy.contains('view').click()
          cy.contains('remove').click()
        })
      })
    })
    describe('When logged in as another user', function() {
      beforeEach(function() {
        cy.login({username: 'otsoro', password: 'kissakoira1'})
        cy.createBlog({
          title: 'yet another title 2',
          url: 'yetanother2.com',
          author: 'yet another author2'
        })
        cy.login({username: 'tester', password: 'tester123'})
      })
      describe('and a blog exists', function() {
        it('one of those can be liked', function() {
          cy.contains('view').click()
          cy.contains('like').click()
        })
        it('one of those can be removed', function() {
          cy.contains('view').click()
          cy.contains('remove').should('not.exist')
        })
      })
    })
    describe('Blogs', function() {
      beforeEach(function () {
        cy.login({username: 'otsoro', password: 'kissakoira1'})
        const blogs = [
          { title: 'First Blog', author: 'Author 1', url: 'http://first.com', likes: 5 },
          { title: 'Second Blog', author: 'Author 2', url: 'http://second.com', likes: 10 },
          { title: 'Third Blog', author: 'Author 3', url: 'http://third.com', likes: 7 }
        ]
    
        blogs.forEach(blog => {
          cy.createBlog(blog)
        })
      })
      it('are ordered by likes', function() {
        cy.get('.blog').eq(0).should('contain', 'Second Blog')
        cy.get('.blog').eq(1).should('contain', 'Third Blog')
        cy.get('.blog').eq(2).should('contain', 'First Blog')
      })
      it('change order when likes change', function() {
        cy.get('.blog').eq(1).contains('view').click()
        cy.contains('like').click()
        cy.contains('like').click()
        cy.contains('like').click()
        cy.contains('like').click()
        cy.contains('like').click()
        cy.get('.blog').eq(0).should('contain', 'Third Blog')
      })
    })
  })