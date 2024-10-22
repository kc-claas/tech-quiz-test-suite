

describe('Quiz cycle', () => {

  context('Beginning quiz',()=> {
    // intercept fetch for Quiz questions/answers, and visit page
    beforeEach(()=>{
      cy.fixture('questions.json').then((fixture)=>{
        cy.intercept('GET', '/api/questions/random', { 
          statusCode: 200,
          body: fixture
        }).as('questionsArray')
      })
      cy.visit('/')
    })

    it('should arrive at the home page and see a start quiz button when visited', () =>{
      cy.contains('Start Quiz')
    })

    it('should get question/answer data and render the first question when the quiz is started', () =>{
      cy.contains('Start Quiz').click()
      cy.wait('@questionsArray').its('response.statusCode').should('eq', 200)
      cy.contains('Test question 1').should('be.visible')
    })
  })


  context('Completing quiz',()=>{
    // shortcut to final question, answering first two questions correctly.
    beforeEach(()=>{   
      cy.fixture('questions.json').then((fixture)=>{
        cy.intercept('GET', '/api/questions/random', { 
          statusCode: 200,
          body: fixture
        }).as('questionsArray')
      })
      cy.visit('/')
      cy.contains('Start Quiz').click()
      cy.wait('@questionsArray')
      cy.get('button').eq(1).click()
      cy.get('button').eq(3).click()

    })

    it('should display the correct score when you answer the final question correctly', () =>{
      cy.get('button').eq(2).click()
      cy.contains('Your score: 3/3').should('be.visible')
    })

    it('should display the correct score when you answer the final question correctly', () =>{
      cy.get('button').eq(1).click()
      cy.contains('Your score: 2/3').should('be.visible')
    })
  })

    context('Starting new quiz',()=>{
      // shortcut to results, ready to click button for new test
      beforeEach(()=>{   
        cy.fixture('questions.json').then((fixture)=>{
          cy.intercept('GET', '/api/questions/random', { 
            statusCode: 200,
            body: fixture
          }).as('questionsArray')
        })
        cy.visit('/')
        cy.contains('Start Quiz').click()
        cy.wait('@questionsArray')
        cy.get('button').eq(1).click()
        cy.get('button').eq(3).click()
        cy.get('button').eq(2).click()
      })

      it('should get new questions/answers and begin a new quiz when you click the Take New Quiz button', () =>{
        cy.fixture('questions-2nd.json').then((fixture)=>{
          cy.intercept('GET', '/api/questions/random', {
            statusCode: 200,
            body: fixture
          }).as('questionsArray2nd')
        })
        cy.contains('Take New Quiz').click()
        cy.wait('@questionsArray2nd').its('response.statusCode').should('eq', 200)
        cy.contains('New test question 1').should('be.visible')
      })

    })
})