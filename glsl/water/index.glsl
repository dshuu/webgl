#ifdef GL_ES
precision mediump float;
#endif
varying vec4 a_position;
varying vec2 a_texcoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture_0;

//noise fn start
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
    
    // Precompute values for skewed triangular grid
    const vec4 C=vec4(.211324865405187,
        // (3.0-sqrt(3.0))/6.0
        .366025403784439,
        // 0.5*(sqrt(3.0)-1.0)
        -.577350269189626,
        // -1.0 + 2.0 * C.x
    .024390243902439);
    // 1.0 / 41.0
    
    // First corner (x0)
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    
    // Other two corners (x1, x2)
    vec2 i1=vec2(0.);
    i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
    vec2 x1=x0.xy+C.xx-i1;
    vec2 x2=x0.xy+C.zz;
    
    // Do some permutations to avoid
    // truncation effects in permutation
    i=mod289(i);
    vec3 p=permute(
        permute(i.y+vec3(0.,i1.y,1.))
        +i.x+vec3(0.,i1.x,1.));
        
        vec3 m=max(.5-vec3(
                dot(x0,x0),
                dot(x1,x1),
                dot(x2,x2)
            ),0.);
            
            m=m*m;
            m=m*m;
            
            // Gradients:
            //  41 pts uniformly over a line, mapped onto a diamond
            //  The ring size 17*17 = 289 is close to a multiple
            //      of 41 (41*7 = 287)
            
            vec3 x=2.*fract(p*C.www)-1.;
            vec3 h=abs(x)-.5;
            vec3 ox=floor(x+.5);
            vec3 a0=x-ox;
            
            // Normalise gradients implicitly by scaling m
            // Approximation of: m *= inversesqrt(a0*a0 + h*h);
            m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
            
            // Compute final noise value at P
            vec3 g=vec3(0.);
            g.x=a0.x*x0.x+h.x*x0.y;
            g.yz=a0.yz*vec2(x1.x,x2.x)+h.yz*vec2(x1.y,x2.y);
            return 130.*dot(m,g);
        }
        //noise fn end
        void main(){
            vec2 st=gl_FragCoord.xy/u_resolution;
            float t=sin(u_time);
            float n=snoise(st);
            vec4 color=texture2D(u_texture_0,vec2(st.x*0.5+t*n*0.1,st.y));
            gl_FragColor=color;
        }