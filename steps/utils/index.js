function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  console.error(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  return undefined
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
  console.error(gl.getProgramInfoLog(program))
  return undefined
}

class NProgram {
  constructor(gl, vertexSouce, fragmentSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSouce)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
    return createProgram(gl, vertexShader, fragmentShader)
  }
}

class NVertex {
  constructor(gl) {
    console.log('NVertex')
  }
}

function setUniform(gl, type, location, value) {
  // value = value.length ? flatten(value) : value;
  // const setValue = gl.renderer.state.uniformLocations.get(location);

  // // Avoid redundant uniform commands
  // if (value.length) {
  //     if (setValue === undefined || setValue.length !== value.length) {
  //         // clone array to store as cache
  //         gl.renderer.state.uniformLocations.set(location, value.slice(0));
  //     } else {
  //         if (arraysEqual(setValue, value)) return;

  //         // Update cached array values
  //         setValue.set ? setValue.set(value) : setArray(setValue, value);
  //         gl.renderer.state.uniformLocations.set(location, setValue);
  //     }
  // } else {
  //     if (setValue === value) return;
  //     gl.renderer.state.uniformLocations.set(location, value);
  // }

  switch (type) {
      case 5126:
          return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value); // FLOAT
      case 35664:
          return gl.uniform2fv(location, value); // FLOAT_VEC2
      case 35665:
          return gl.uniform3fv(location, value); // FLOAT_VEC3
      case 35666:
          return gl.uniform4fv(location, value); // FLOAT_VEC4
      case 35670: // BOOL
      case 5124: // INT
      case 35678: // SAMPLER_2D
      case 35680:
          return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value); // SAMPLER_CUBE
      case 35671: // BOOL_VEC2
      case 35667:
          return gl.uniform2iv(location, value); // INT_VEC2
      case 35672: // BOOL_VEC3
      case 35668:
          return gl.uniform3iv(location, value); // INT_VEC3
      case 35673: // BOOL_VEC4
      case 35669:
          return gl.uniform4iv(location, value); // INT_VEC4
      case 35674:
          return gl.uniformMatrix2fv(location, false, value); // FLOAT_MAT2
      case 35675:
          return gl.uniformMatrix3fv(location, false, value); // FLOAT_MAT3
      case 35676:
          return gl.uniformMatrix4fv(location, false, value); // FLOAT_MAT4
  }
}
