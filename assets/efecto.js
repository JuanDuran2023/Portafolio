<script id="fragShader" type="x-shader/x-fragment">
  precision mediump float;

  uniform float iTime;
  uniform vec2 iResolution;

  void mainImage(out vec4 fragColor, in vec2 fragCoord)
  {
      vec2 uv = fragCoord.xy / iResolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= iResolution.x / iResolution.y;

      float wave = sin(uv.y * 10.0 + iTime) * 0.1;
      float r = 0.0, g = 0.1, b = 0.2;
      r += wave;
      g += wave * 0.5;
      b += wave * 0.8;

      fragColor = vec4(r, g, b, 1.0);
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
</script>

<script>
  const canvas = document.getElementById('shader-bg');
  const gl = canvas.getContext('webgl');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const vertexShaderSrc = `
    attribute vec4 position;
    void main() {
      gl_Position = position;
    }
  `;

  const fragShaderSrc = document.getElementById('fragShader').textContent;

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragShaderSrc);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const position = gl.getAttribLocation(program, 'position');
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const iTime = gl.getUniformLocation(program, 'iTime');
  const iResolution = gl.getUniformLocation(program, 'iResolution');

  function render(time) {
    time *= 0.001;
    gl.uniform1f(iTime, time);
    gl.uniform2f(iResolution, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
</script>