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

class Program {
  program = null // gl.program
  uniforms = {} //
  uniformLocations = new Map() // 位置的map
  constructor(gl, { vertex, fragment, uniforms } = params) {
    this.gl = gl
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
    this.uniforms = uniforms

    this.program = createProgram(gl, vertexShader, fragmentShader)
    const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS)
    for (let ii = 0; ii < numUniforms; ii++) {
      let uniform = gl.getActiveUniform(this.program, ii)
      uniform.uniformName = uniform.name
      const uniformLocation = gl.getUniformLocation(this.program, uniform.name)
      this.uniformLocations.set(uniform, uniformLocation)
    }
    //attributes map
    this.attributeLocations = new Map()
    const locations = []
    const numAttribs = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_ATTRIBUTES
    )
    for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
      const attribute = gl.getActiveAttrib(this.program, aIndex)
      const location = gl.getAttribLocation(this.program, attribute.name)
      // Ignore special built-in inputs. eg gl_VertexID, gl_InstanceID
      if (location === -1) continue
      locations[location] = attribute.name
      this.attributeLocations.set(attribute, location)
    }
    console.log('attributeLocations==>', this.attributeLocations)
  }
  use() {
    this.uniformLocations.forEach((location, activeUniform) => {
      const uniform = this.uniforms[activeUniform.name]
      setUniform(this.gl, activeUniform.type, location, uniform.value)
    })
  }
}

class Geometry {
  constructor(gl, { attributes = {} } = params, program) {
    // for (let key in attributes) {
    //   this.addAttribute(key, attributes[key])
    // }
    // console.log('attributes==>',this.attributes);
    this.gl = gl
    this.program = program
    this.positionBuffer = gl.createBuffer()
    this.colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(attributes['a_position']),
      gl.STATIC_DRAW
    )
    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)
    let positionAttributeLocation, colorAttributeLocation
    program.attributeLocations.forEach((location, { name, type }) => {
      if (name === 'a_position') {
        positionAttributeLocation = location
      }
      if (name === 'a_color') {
        colorAttributeLocation = location
      }
    })
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
    //颜色
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array(attributes['a_color']),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(colorAttributeLocation)
    //TODO 这里要根据类型size
    gl.vertexAttribPointer(
      colorAttributeLocation,
      3,
      gl.UNSIGNED_BYTE,
      true,
      0,
      0
    )
  }
  addAttribute(key, attr) {
    this.attributes[key] = attr
  }
  render() {
    this.gl.bindVertexArray(this.vao)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.useProgram(this.program.program)
    this.program.use()
    //TODO 这里要根据类型读 count
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 96)
  }
}
function setUniform(gl, type, location, value) {
  switch (type) {
    case 5126:
      return value.length
        ? gl.uniform1fv(location, value)
        : gl.uniform1f(location, value) // FLOAT
    case 35664:
      return gl.uniform2fv(location, value) // FLOAT_VEC2
    case 35665:
      return gl.uniform3fv(location, value) // FLOAT_VEC3
    case 35666:
      return gl.uniform4fv(location, value) // FLOAT_VEC4
    case 35670: // BOOL
    case 5124: // INT
    case 35678: // SAMPLER_2D
    case 35680:
      return value.length
        ? gl.uniform1iv(location, value)
        : gl.uniform1i(location, value) // SAMPLER_CUBE
    case 35671: // BOOL_VEC2
    case 35667:
      return gl.uniform2iv(location, value) // INT_VEC2
    case 35672: // BOOL_VEC3
    case 35668:
      return gl.uniform3iv(location, value) // INT_VEC3
    case 35673: // BOOL_VEC4
    case 35669:
      return gl.uniform4iv(location, value) // INT_VEC4
    case 35674:
      return gl.uniformMatrix2fv(location, false, value) // FLOAT_MAT2
    case 35675:
      return gl.uniformMatrix3fv(location, false, value) // FLOAT_MAT3
    case 35676:
      return gl.uniformMatrix4fv(location, false, value) // FLOAT_MAT4
  }
}

function radToDeg(r) {
  return (r * 180) / Math.PI
}

function degToRad(d) {
  return (d * Math.PI) / 180
}
