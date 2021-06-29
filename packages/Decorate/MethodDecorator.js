function clean(constructor) {
  return class extends constructor {
    ngOnDestroy() {
      console.log('Cleaning....')
      // Auto Clean things and call the original method
      constructor.prototype.ngOnDestroy.apply(this, arguments);
    }
  }
}

function timeout(milliseconds = 0) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function() {
      setTimeout(() => {
        originalMethod.apply(this, arguments);
      }, milliseconds)
    };

    return descriptor;
  }
}

@clean
class HelloComponent {
  ngOnDestroy() {
    console.log('ngOnDestroy - HelloComponent');
  }

  @timeout() 
  demoMethod() {
    console.log('demoMethod');
  }
  
  @timeout(2000)
  demoMethod2() {
    console.log('demoMethod2');
  }
}

const helloComponet = new HelloComponent();
helloComponet.ngOnDestroy();
helloComponet.demoMethod();
helloComponet.demoMethod2();