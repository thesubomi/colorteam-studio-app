import React from 'react';
import ReactDOM from 'react-dom/client';
import * as supabase from '@supabase/supabase-js';
import * as htmlToImage from 'html-to-image';
// The screens were written against CDN globals; keep those names available.
window.React = React;
window.ReactDOM = ReactDOM;
window.supabase = supabase;
window.htmlToImage = htmlToImage;
// jsPDF is only needed for PDF export, so it loads on first use.
window.ctLoadJsPdf = () => import('jspdf').then(m => ({ jsPDF: m.jsPDF }));
