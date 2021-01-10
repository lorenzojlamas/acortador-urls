# Acortador de URLs

## Aclaraciones sobre el problema a resolver

- No había realizado functions de gcp hasta el momento, ante el desconocimietno me base en [firebase/functions-samples](https://github.com/firebase/functions-samples/tree/master/quickstarts/uppercase/functions), [firebase-functions-jest](https://github.com/jedfonner/firebase-functions-jest) y el init de firebase.
- Me hubiera gustado realizar el proyecto en Typescript, me siento más cómodo utlizandolo.
- Tengo dominio en el stack mocha/chai/sinon, primera vez utilizando jest, se me complico el setup/mock para los test.
- Al no dominiar muy bien el entorno no pude realizar TDD y quedo muy pegada la solución al framework.
- Al ser poco el tiempo opte por conetarme directo a la db, una primera implementación en memoría talvez hubiera sido más cómodo.
- Me hubiera gustado "conocer el uso" o condiciones para implementar alguna cosita más, en particular:
  - Si tienen vencimieto las claves
  - Si pueden existir dos claves con la misma url

## Puntos que debería mejorar en el código

- Dockerizarlo
- Sumar casuistica a los test
- Manejo de enviroment
- Sistema de logging
- Separarme un poco del framework
- Permitir una implementación en memoria
- Manejo de errores más prolijo
- Circuito de CI/CD
- Esquema de openApi

## Ejecución


 Se encuentra dentro del repositorio **colección y enviroment de Postman** para probarlo comodamente o si no el buen amigo curl:

``` bash
curl --location --request GET 'https://us-central1-test-properati-8124e.cloudfunctions.net/clipUrl?url=https://www.google.com/'
```

``` bash
curl --location --request GET 'https://us-central1-test-properati-8124e.cloudfunctions.net/goTo/?key=8UFmBb'
```
