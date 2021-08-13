#ifndef __QUADTREE_H_59CAE94A_E937_42AD_AA27_794E467715BB__  
    #define __QUADTREE_H_59CAE94A_E937_42AD_AA27_794E467715BB__  
      
      
      
      
    /* 一个矩形区域的象限划分：: 
     
    UL(1)   |    UR(0) 
    ----------|----------- 
    LL(2)   |    LR(3) 
    以下对该象限类型的枚举 
    */  
    typedef enum  
    {  
        UR = 0,  
        UL = 1,  
        LL = 2,  
        LR = 3  
    }QuadrantEnum;  
      
    /*空间对象MBR信息*/  
    typedef struct SHPMBRInfo  
    {  
        int nID;        //空间对象ID号  
        MapRect Box;    //空间对象MBR范围坐标  
    }SHPMBRInfo;  
      
    /* 四叉树节点类型结构 */  
    typedef struct QuadNode  
    {  
        MapRect     Box;            //节点所代表的矩形区域  
        int         nShpCount;      //节点所包含的所有空间对象个数  
        SHPMBRInfo* pShapeObj;      //空间对象指针数组  
        int     nChildCount;        //子节点个数  
        QuadNode  *children[4];     //指向节点的四个孩子   
    }QuadNode;  
      
    /* 四叉树类型结构 */  
    typedef struct quadtree_t  
    {  
        QuadNode  *root;  
        int         depth;           // 四叉树的深度                      
    }QuadTree;  
      
      
        //初始化四叉树节点  
        QuadNode *InitQuadNode();  
      
        //层次创建四叉树方法（满四叉树）  
        void CreateQuadTree(int depth,GeoLayer *poLayer,QuadTree* pQuadTree);  
      
        //创建各个分支  
        void CreateQuadBranch(int depth,MapRect &rect,QuadNode** node);  
      
        //构建四叉树空间索引  
        void BuildQuadTree(GeoLayer*poLayer,QuadTree* pQuadTree);  
      
        //四叉树索引查询(矩形查询)  
        void SearchQuadTree(QuadNode* node,MapRect &queryRect,vector<int>& ItemSearched);  
      
        //四叉树索引查询(矩形查询)并行查询  
        void SearchQuadTreePara(vector<QuadNode*> resNodes,MapRect &queryRect,vector<int>& ItemSearched);  
      
        //四叉树的查询（点查询）  
        void PtSearchQTree(QuadNode* node,double cx,double cy,vector<int>& ItemSearched);  
      
        //将指定的空间对象插入到四叉树中  
        void Insert(long key,MapRect &itemRect,QuadNode* pNode);  
      
        //将指定的空间对象插入到四叉树中  
        void InsertQuad(long key,MapRect &itemRect,QuadNode* pNode);  
      
        //将指定的空间对象插入到四叉树中  
        void InsertQuad2(long key,MapRect &itemRect,QuadNode* pNode);  
      
        //判断一个节点是否是叶子节点  
        bool IsQuadLeaf(QuadNode* node);  
      
        //删除多余的节点  
        bool DelFalseNode(QuadNode* node);  
      
        //四叉树遍历(所有要素)  
        void TraversalQuadTree(QuadNode* quadTree,vector<int>& resVec);  
      
        //四叉树遍历（所有节点）  
        void TraversalQuadTree(QuadNode* quadTree,vector<QuadNode*>& arrNode);  
      
        //释放树的内存空间  
        void ReleaseQuadTree(QuadNode** quadTree);  
      
        //计算四叉树所占的字节的大小  
        long CalByteQuadTree(QuadNode* quadTree,long& nSize);  
      
      
    #endif 