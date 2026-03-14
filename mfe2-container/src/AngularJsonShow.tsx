import React, { useEffect, useRef } from 'react';
import { loadRemoteModule } from '@softarc/native-federation';

interface AngularJsonShowProps {
  data: any;
}

const AngularJsonShow: React.FC<AngularJsonShowProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unmountFn: ((container: HTMLElement) => void) | null = null;
    let isMounted = true;

    const loadAndMount = async () => {
      try {
        const module = await loadRemoteModule('mfe1', './JsonShowWrapper');
        if (!isMounted || !containerRef.current) return;

        unmountFn = await module.mount(containerRef.current, { data });

        // If the component unmounted while we were waiting for mount() to resolve,
        // we need to immediately unmount the Angular app to prevent a memory leak.
        if (!isMounted && unmountFn && containerRef.current) {
           unmountFn(containerRef.current);
        }
      } catch (error) {
        console.error('Error loading or mounting Angular JsonShow from mfe1:', error);
      }
    };

    loadAndMount();

    return () => {
      isMounted = false;
      if (unmountFn && containerRef.current) {
        unmountFn(containerRef.current);
      }
    };
  }, [data]); // Re-mount or handle data changes if necessary. For simplicity, re-mounting on data change here.

  return <div ref={containerRef}></div>;
};

export default AngularJsonShow;
